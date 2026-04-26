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


const registeruser = asyncHandler(async (req, res) => {

   // check postman 
    res.status(200).json({
        message: "ok "
    });

    // Get user data from frontend request body
    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    // Validation: check if any field is empty
    if (
        [fullname, email, password, username].some(
            (field) => field?.trim() == ""
        )
    ) {
        throw new ApiError(400, "All fields are required ");
    }

    //  Check if user already exists (by email or username)
    const exsisteduser = User.findOne({
        $or: [{ username }, { email }]
    });

    // BUG: missing await (this will always be truthy)
    if (exsisteduser) {
        throw new ApiError(409, "user with email or username already exist");
    }

    // get uploaded file paths from Multer
    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverimagelocalpath = req.files?.coverimage[0]?.path;

    //Avatar is required
    if (!avatarlocalpath) {
        throw new ApiError(400, "avatar file is required ");
    }

    // Upload images to Cloudinary
    const avatar = await uploadoncloudinary(avatarlocalpath);
    const coverimage = await uploadoncloudinary(coverimagelocalpath);

    // If avatar upload fails
    if (!avatar) {
        throw new ApiError(400, "avatar file is required ");
    }

    //  Create new user in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,                // store Cloudinary URL
        coverimage: coverimage?.url || "", // optional
        email,
        password,                          // should be hashed in model
        username: username.toLowerCase()   // normalize username
    });

    // 🔐 Remove sensitive fields (password, refreshToken)
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // ❌ Check if user creation failed
    if (!createduser) {
        throw new ApiError(500, "something went wrong in registration");
    }

    // ✅ Send success response
    return res.status(201).json(
        new ApiResponse(200, createduser, "user registered successfully")
    );
});

export { registeruser };