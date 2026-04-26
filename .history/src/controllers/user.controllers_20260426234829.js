import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import{ User} from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js"

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
    // check images and avatar 
    const avatarlocalpath =  req.files?.avatar[0]?.path;
   const coverimagelocalpath =  req.files?.coverimage[0]?.path;
   if(!avatarlocalpath){
    throw new ApiError(400 ,"avatar file is required ");
   }
   //upload them to cloudinary 
  const avatar = await uploadoncloudinary(avatarlocalpath)
 const coverimage = await uploadoncloudinary(coverimagelocalpath)

 if(!avatar){
     throw new ApiError(400 ,"avatar file is required ");
 }
 //MAKE OBJECT make entery in database 
const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverimage :coverimage?.url || "",
    email,
    password,
   username: username.toLowerCase()

 })

 const createduser  = await User.fin

}) 

export{registeruser};