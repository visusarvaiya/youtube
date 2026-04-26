import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
const registeruser = asyncHandler(async(req , res )=>{
    res.status(200).json({
        message :"ok "
    })
    // export user detail from frontend
    const {fullname ,email , username ,password } = req.body ;
    console.log("email:" , email  );

    // check validation 
    if(fullname === ""){
        throw 
    }
}) 

export{registeruser};