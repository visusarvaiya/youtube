import { asyncHandler } from "../utils/asyncHandler.js"; 
// Wrapper to handle async errors automatically (no need for try-catch everywhere)

import { ApiError } from "../utils/ApiErrors.js"; 
// Custom error class to send structured error responses

import { User } from "../models/user.model.js"; 
// Mongoose model for User collection (MongoDB)

import { uploadoncloudinary } from "../utils/cloudinary.js"; 
// Function to upload files (images) to Cloudinary

import { ApiResponse } from "../utils/ApiResponse.js";
// Standard response structure for success responses

import {jwt} from "jsonwebtoken"; 
import { app } from "../app.js";


const generateaccesandrefreshtoken  = async(userid)=>{
    try{
        const user = await User.findById(userid)
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()
       // rfshtokn save in db
        user.refreshToken = refreshtoken 
        user.save({validateBeforeSave: false })

        return{accesstoken , refreshtoken}
    }
    catch(error){
        throw new ApiError(401 ,"something went wrong while generating access and refresh token ")
    }
}
//...................................................................
const registeruser = asyncHandler(async (req, res) => {

    // Get user data from frontend request body
    const { fullname, email, username, password } = req.body;

    // Validation: check if any field is empty
    if (
        [fullname, email, password, username].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    //  Check if user already exists (by email or username)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // get uploaded file paths from Multer
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

     // Upload images to Cloudinary (avatar is optional)
    const avatarUrl = avatarLocalPath ? await uploadoncloudinary(avatarLocalPath) : null;
    const coverImageUrl = coverImageLocalPath ? await uploadoncloudinary(coverImageLocalPath) : null;
    //  Create new user in database
    const user = await User.create({
        fullname,
        avatar: avatarUrl?.url || "",       // optional - empty string if no avatar
        coverImage: coverImageUrl?.url || "",  // optional - empty string if no cover image
        email,
        password,                           // should be hashed in model
        username: username.toLowerCase()   // normalize username
    });

    //  Remove sensitive fields (password, refreshToken)
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //  Check if user creation failed
    if (!createduser) {
        throw new ApiError(500, "something went wrong in registration");
    }

    //  Send success response
    return res.status(201).json(
        new ApiResponse(201, createduser, "User registered successfully")
    );
});


//...................................................................
const loginuser =asyncHandler(async(req,res)=>{
    // req body
    const{email,username,password}= req.body

    //username or email 
    if(!username && !email){
        throw new ApiError(400  , "email or username is required ");
    }
    // check if already registered
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    // check user exist or not if not then 
    if(!user){
        throw new ApiError(404 ,"user doesnt exist")
    }
    //if user exist check passward 
    const ispasswordvalid = await user.isPasswordCorrect(password)
    if(!ispasswordvalid){
        throw new ApiError(401 ,"password incorrect !")
    }
    // now password is correct make access and refresh token for accessing api and security
    const{accesstoken, refreshtoken} = await generateaccesandrefreshtoken(user._id)
 // Get user without sensitive fields
    const loginuser = await User.findById(user._id).select("-password -refreshToken")
 // modifiable by server not by frontend 
    const option ={
     httpOnly :true ,
     secure :process.env.NODE_ENV === "production"     // only sent over HTTPS in production
    }

    return res 
    .status(200)
    .cookie("accesstoken", accesstoken,option)
    .cookie("refreshtoken", refreshtoken,option)
    .json(
        //Keeps response format consistent
        new ApiResponse(200,{
            user: loginuser ,accesstoken,refreshtoken
        },
         "user logged in successfully "
    )
    )


});
//......................................................................................

   // 🔍 Find the logged-in user using ID (comes from auth middleware)
   // remove refresh token 
   // cookies store refresh and accss token , prof to access the api , remove cookies , remove on token no acess
const logoutuser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken : undefined //      invalidate refresh token in DB
        }
      
    },
      {
            new:true //returns updated document 
        }
  )

    const option = {
     httpOnly :true ,
     secure :process.env.NODE_ENV === "production"     // only sent over HTTPS in production
    }
    return res
    .status(200)
    .clearCookie("accesstoken",option) // rmv acess and fresh token 
    .clearCookie("refreshtoken",option)
    .json(new ApiResponse(200 ,{},"user logged out ")) // res to client

})
//.........................................................................................

const refreshaccesstoken = asyncHandler(async(req,res)=>{
      // Get refresh token from:
   // 1. Cookies (most secure - httpOnly)
   // 2. Request body (used in mobile apps / APIs)
    const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken
  //  no refresh token → user is not authenticated
     if(!incomingrefreshtoken){throw new ApiError(401 ,"unauthorized request ")}

  try {
       // Verify refresh token using secret
      // WHY:
      // - ensures token is not tampered
      // - ensures token is not expired
     const decodedtoken = jwt.verify(
        incomingrefreshtoken,
        process.env.REFRESH_TOKEN_SECERT
     )
     //  Find user from DB using ID stored in token
      // WHY:
      // - make sure user still exists


     const user = await User.findById(decodedtoken?._id)
     if(!user){
        throw new ApiError(401 ,"invalid refresh token")
     }
          //  Compare incoming token with DB token
      // WHY:
      // - prevents reuse of old/stolen refresh tokens
      // - ensures only latest token is valid (token rotation)
     if(incomingrefreshtoken !== user?.refreshToken){
        throw new ApiError(401 ,"refresh token is expired or used")
     }
      Cookie options (secure settings)
     const option ={
        httpOnly:true,
        secure:true
     }
    const {accesstoken , newrefreshtoken} = await generateaccesandrefreshtoken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken,option)
    .cookie("refreshToken", newrefreshToken,option)
    .json(
        new ApiResponse(
            200,{
                accessToken,refreshToken:newrefreshtoken
            },"ACCESS TOKEN REFRESHED"
        )
    )
  } catch (error) {
    throw new ApiError(401 ,error?.message || "invalid refresh token")
  }
})
export { registeruser, loginuser, logoutuser,refreshaccesstoken };