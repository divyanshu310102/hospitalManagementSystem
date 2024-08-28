
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";


//*****************************Generate Access And Refresh Token ****************************************** */

const generateAccessAndRefreshTokens = async(userId) =>{
  try {
      //generate access token
      //generate refresh token
      //return access and refresh tokens
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})

      return {accessToken, refreshToken}
      
  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating Access and Refresh Tokens")
  }
}

//****************************************************************************************************************** */




//**********************************Registeration of Patient*******************************************************

 const patientRegister = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, username, phone, nic, dob, gender, password } =
    req.body;

    console.log(req.body)
  if([firstName, lastName, email, username, phone, nic, dob, gender, password].some((field) =>
         field?.trim() === "")){
    throw new ApiError(400, "All fields are required")
}

  
const existedUser = await User.findOne({
    $or:[{ username }, { email }]
})

if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
}


  const patient = await User.create({
    firstName,
    lastName,
    email,
    username,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  })

  const createdUser = await User.findById(patient._id).select("-password -refreshToken")
  if(!createdUser){
    throw new ApiError(500, "Something went wrong registering the Patient")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "Patient registered successfully")
)
  
});

//*************************************************************************************************************




//********************************************Register a Doctor***************************************************** 

const addNewDoctor = asyncHandler(async (req, res) => {
      
      const {
        firstName,
        lastName,
        username,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment
      } = req.body;

      if([firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment].some((field) =>
        field?.trim() === "")){
   throw new ApiError(400, "All fields are required")
}

      const existedUser = await User.findOne({
        $or: [{ username }, { email }]
      })

      if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
      }

      const docAvatarLocalPath = req.file.path
      
      if(!docAvatarLocalPath){
        throw new ApiError(400, "Avatar Image is required")
    }

    const docAvatar = await uploadFileToCloudinary(docAvatarLocalPath)

    if(!docAvatar){
        throw new ApiError(500, "Failed to upload avatar image to cloudinary")
    }


    const doctor = await User.create({
        docAvatar: docAvatar.url,
        firstName,
        lastName,
        email,
        username,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment,
        role: "Doctor",
      })

      const createdUser = await User.findById(doctor._id).select("-password -refreshToken")
      if(!createdUser){
        throw new ApiError(500, "Something went wrong registering the Doctor")
      }

      return res.status(201).json(
        new ApiResponse(200, createdUser, "Doctor registered successfully")
      )
     
    });

    //*****************************************************************************************************





//********************************************Register Admin*******************************************************

 const addNewAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, phone, nic, dob, gender, password } =
    req.body;

    if([firstName, lastName, email, username, phone, nic, dob, gender, password].some((field) =>
        field?.trim() === "")){
   throw new ApiError(400, "All fields are required")
}
  

const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    username,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  const createdUser = await User.findById(admin._id).select("-password -refreshToken")
  if(!createdUser){
    throw new ApiError(500, "Something went wrong registering the Admin")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "Admin registered successfully")
  )


  
});

//********************************************************************************************************************






//******************************************************User Login **************************************** */

 const login = asyncHandler(async (req, res) => {

  const { email, password, username, confirmPassword, role } = req.body;
// console.log(email, password, username, confirmPassword, role)
  if([(email || username), password, confirmPassword, role].some((field) =>
    field?.trim() === "")){
throw new ApiError(400, "All fields are required")
}
  
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password not matched with confirm password")
  }
  const user = await User.findOne({
    $or: [{username}, {email}]
})

// console.log(user)

if(!user){
  throw new ApiError(404, "User does not exist")
}

const isPasswordValid = await user.generateAuthToken(password)

if(!isPasswordValid){
  throw new ApiError(401, "Invalid credentials")
}

const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

if(!loggedInUser){
  throw new ApiError(500, "Something went wrong while logging in")
}

const options = {
  httpOnly: true,
  secure: false
}

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(200,
    {
      user: loggedInUser,accessToken,refreshToken
    }
    , "Logged in successfully")
)
 
});

//********************************************************************************************************************



//**************************************************Get user details************************************************* */

 const getUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log(user)
  return res
  .status(200)
  .json(
    new ApiResponse(200,user,"User fetched successfully")
  );
});

//***************************************************************************************************************** */




//**************************************************LogOut User************************************************* */

const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user.id,
    {
      $set:{
        refreshToken: undefined
      }  
    },
    {
      new : true
    }
  )

  const options = {
    httpOnly: true,
    secure : false
}

  return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, "User logged out successfully"))
})

//*************************************************************************************************************** */











// // Logout function for dashboard admin
// export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
//   res
//     .status(201)
//     .cookie("adminToken", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .json({
//       success: true,
//       message: "Admin Logged Out Successfully.",
//     });
// });

// // Logout function for frontend patient
// export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
//   res
//     .status(201)
//     .cookie("patientToken", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .json({
//       success: true,
//       message: "Patient Logged Out Successfully.",
//     });
// });

export {patientRegister,addNewDoctor,addNewAdmin,login,getUserDetails,logoutUser};