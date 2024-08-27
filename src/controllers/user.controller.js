
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { uploadFileToCloudinary } from "../utils/cloudinary.js";


//********************Registeration of Patient************************

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


  const user = await User.create({
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

  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser){
    throw new ApiError(500, "Something went wrong registering the Patient")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "Patient registered successfully")
)
  
});


//*******************************************************************




//*****************Register a Doctor******************
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


    const user = await User.create({
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

      const createdUser = await User.findById(user._id).select("-password -refreshToken")
      if(!createdUser){
        throw new ApiError(500, "Something went wrong registering the Doctor")
      }

      return res.status(201).json(
        new ApiResponse(200, createdUser, "Doctor registered successfully")
      )
     
    });


    //******************************************** */








// export const login = catchAsyncErrors(async (req, res, next) => {
//   const { email, password, confirmPassword, role } = req.body;
//   if (!email || !password || !confirmPassword || !role) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }
//   if (password !== confirmPassword) {
//     return next(
//       new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
//     );
//   }
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new ErrorHandler("Invalid Email Or Password!", 400));
//   }

//   const isPasswordMatch = await user.comparePassword(password);
//   if (!isPasswordMatch) {
//     return next(new ErrorHandler("Invalid Email Or Password!", 400));
//   }
//   if (role !== user.role) {
//     return next(new ErrorHandler(`User Not Found With This Role!`, 400));
//   }
//   generateToken(user, "Login Successfully!", 201, res);
// });

// export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
//   const { firstName, lastName, email, phone, nic, dob, gender, password } =
//     req.body;
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !phone ||
//     !nic ||
//     !dob ||
//     !gender ||
//     !password
//   ) {
//     return next(new ErrorHandler("Please Fill Full Form!", 400));
//   }

//   const isRegistered = await User.findOne({ email });
//   if (isRegistered) {
//     return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
//   }

//   const admin = await User.create({
//     firstName,
//     lastName,
//     email,
//     phone,
//     nic,
//     dob,
//     gender,
//     password,
//     role: "Admin",
//   });
//   res.status(200).json({
//     success: true,
//     message: "New Admin Registered",
//     admin,
//   });
// });

// 

// export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
//   const doctors = await User.find({ role: "Doctor" });
//   res.status(200).json({
//     success: true,
//     doctors,
//   });
// });

// export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

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

export {patientRegister,addNewDoctor};