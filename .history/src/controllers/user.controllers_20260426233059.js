import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import{ User} from "../models/user.model.js"

const registeruser = asyncHandler(async(req , res )=>{
    res.status(200).json({
        message :"ok "
    })
    // export user detail from frontend
    const {fullname ,email , username ,password } = req.body ;
    console.log("email:" , email  );

    // check validation 
    if(
        [fullname,email,password,username].some((field)=> field?.trim()==""
        )
    )
    {
        throw new ApiError(400 ,"All fields are required ")
    }
  // check user already exist or not 
    const exsisteduser = User.findOne({
        $or:[{username},{email}]
    })
    if(exsisteduser){
        throw new ApiError(409 ,"user with email or username already exist")
    }
    
    const avatarlocalpath =  req.files?.avatar[0]?.path;
  req.files

}) 

export{registeruser};