import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";



export const verifyJWT = asyncHandler(async(req , res, next )=>{
   try{
     const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","")
    if(!token){
        throw new ApiError(401 ,"unathorized request")
    }
    const decodetoken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECERT)
    const user = await User.findById(decodetoken?._id).select("-password -refreshToken")
    if(!user){

        throw new ApiError(401 ,"invalid access token ")
    }
    req.user =user ;
    next()
   }catch(error){
     throw new ApiError(error?.message || "invalid")
   }
     

})