import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";



 
    const VerifyJWT = asyncHandler(async (req,res,next) => {

        
        try {
            // console.log(req.cookies.accessToken)
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
            
            if(!token){
                throw new ApiError(401, "Invalid Access Request")
            }
        
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            if(!user){
                throw new ApiError(404, "User not found")
            }
            req.user = user
            next();
    
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid Access Token")
            
        }


})

export  {VerifyJWT};