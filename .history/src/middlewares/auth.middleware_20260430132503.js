import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";



export const verifyJWT = asyncHandler(async(req , res, next )=>{
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","")
    if(!token){
        throw new ApiError
    }
})