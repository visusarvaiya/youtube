import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";



export const verifyJWT = asyncHandler(async(req , res, next )=>{
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","")
    if(!token){
        throw new ApiError(401 ,"unathorized request")
    }
    const decodetoken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECERT)
    await User.findById(decodetoken.)
     

})