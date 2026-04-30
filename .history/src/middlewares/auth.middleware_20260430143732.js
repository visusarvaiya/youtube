import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";



export const verifyJWT = asyncHandler(async(req , _, next )=>{
   try{

         // 🔍 Get token from either:
      // 1. Cookies (preferred when using httpOnly cookies)
      // 2. Authorization header (used in APIs / mobile apps)
     const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","")
    if(!token){
        throw new ApiError(401 ,"unathorized request")
    }
    // token found

      // 🔐 Verify token using secret key
      // This checks:
      // - token is not tampered
      // - token is not expired
    const decodetoken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECERT)


        // 🔍 Fetch user from DB using ID stored inside token
      // Also remove sensitive fields like password & refreshToken
    const user = await User.findById(decodetoken?._id).select("-password -refreshToken")
    if(!user){

        throw new ApiError(401 ,"invalid access token ")
    }


    // Attach user to request object
      // So next middleware/controllers can use req.user
    req.user =user ;

    //Pass control to next middleware/controller
    next()
   }catch(error){
     throw new ApiError(error?.message || "invalid access token ")
   }
     

})