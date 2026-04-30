import { asyncHandler } from "../utils/asyncHandler.js"; 
// Wrapper to handle async errors automatically (no need for try-catch everywhere)

import { ApiError } from "../utils/ApiErrors.js"; 
// Custom error class to send structured error responses

import { User } from "../models/user.model.js"; 
// Mongoose model for User collection (MongoDB)

import { uploadoncloudinary } from "../utils/cloudinary.js"; 
// Function to upload files (images) to Cloudinary

import { ApiResponse } from "../utils/ApiResponse.js"
// Standard response structure for success responses
const generateaccesandrefreshtoken  = async(userid)=>{
    try{
        const user = await User.findById(userid)
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()
       // rfshtokn save in db
        user.refreshtoken = refreshtoken 
        user.save({validationBeforeSave: false })

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
    if(!username || !password){
        throw new ApiError(400  , "email or password is required ");
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
    const loginuser = await user.findById(user._id).select("-password -refreshtoken")
 // modifiable by server not by frontend 
    const option ={
     httpOnly :true ,
     secure :true     // only sent over HTTPS
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

const logoutuser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken : undefined
        },
        {
            new:true
        }
    }
  )
})
export { registeruser, loginuser, logoutuser };