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
    if(!username || )

});
export { registeruser, loginuser };