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

import jwt from "jsonwebtoken";


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
        throw new ApiError(400, "username or email is required");
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
      // Cookie options (secure settings)
     const option ={
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"
     }
           //  Generate new tokens (access + refresh)
      // WHEN:
      // - access token expired
      // - user wants to stay logged in
    const {accesstoken , refreshtoken} = await generateaccesandrefreshtoken(user._id)

    return res
    .status(200)
    .cookie("accesstoken", accesstoken,option)// Set new access token cookie
    .cookie("refreshtoken", refreshtoken,option)// set new refresh token cookie (rotated)
    .json(
        new ApiResponse(
            200,{
                accesstoken,refreshtoken
            },"Access token refreshed successfully"
        )
    )
  } catch (error) {
    throw new ApiError(401 ,error?.message || "invalid refresh token")
  }
})

const changecurrentpassword = asyncHandler(async(req, res)=>{
    const {oldpassword , newpassword}=req.body
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Old Password")

        user.password = newpassword
        await user.save({validateBeforeSave:false})

        return res
        .status(200)
        .json(new ApiResponse(200 ,{},"Password Chnagwed Successfully !"))
    }
})

const getcurrentuser = asyncHandler(async(req, res )=>{
    return res
    .status(200)
    .json(200 ,req.user,"current user is fetched successfully ")
})

const updateaccountdetails = asyncHandler(async(req,res)=>{
    const{fullname , email } = req.body

    if(!fullname || !email){
        throw new ApiError(400 ,"all fields are required")
         
    }
  //Find the logged-in user by ID and update details
    const user = await User.findByIdAndUpdate(
        //ID of currently logged-in user
        //comes from auth.middleware
        req.user?._id,  // if request user exsist return id else no app crash
        {
            // data to update in database
            $set:{
                fullname,  // update fullname
                email:email //update email
            }
        }, 
     // new:true → return updated document instead of old document
        {new:true}

   // Remove password field from returned user data
    ).select("-password")
  //Send success response
    return res
    .status(200)
  // Send JSON response using custom ApiResponse class

    .json(new ApiResponse(200 , user ,"Account details updated successfully"))
})
// Controller function to update user avatar
const updateuseravatar = asyncHandler(async(req, res)=>{
    //  Get uploaded file path from req.file
   // req.file is added by Multer middleware
   // ?. is optional chaining (safe access)
   const avatarLocalPath = req.file?.path
      // If no file exists, throw custom error
   if(!avatarLocalPath){
    throw new ApiError(400, "avatar file is missing")
   }
  
   //  Upload avatar image to Cloudinary
   // avatar will contain Cloudinary response data
   const avatar = await uploadoncloudinary(avatarLocalPath)


   // Check if upload failed
   // avatar.url should contain uploaded image URL
   if(!avatar.url){
    throw new ApiError(400 ,"error while uploading avatar ")
   }
   // Find logged-in user and update avatar field
   const user = await User.findByIdAndUpdate(
    //Current logged-in user's ID
     req.user?._id,

     // data to update
     {
        $set:{
            // Save Cloudinary image URL in database

            avatar:avatar.url
        }
     },
     {
        //     // Return updated document instead of old document
        new :true
     }
     // Remove password field from returned user object
   ).select("-password")
// success response
     return res
   .status(200)
   .json(
     new ApiResponse(200 ,user ,"avatar updated successfully " )
   )


})

const updatecoverimage= asyncHandler(async(req, res)=>{
   const coverImageLocalPath = req.file?.path

   if(!coverImageLocalPath){
    throw new ApiError(400, "coverimage file is missing")
   }

   const coverImage = await uploadoncloudinary(coverImageLocalPath)
   if(!coverImage.url){
    throw new ApiError(400 ,"error while uploading coverimage")
   }

   const user =  await User.findByIdAndUpdate(
     req.user?._id,
     {
        $set:{
            coverImage:coverImage.url
        }
     },
     {
        new :true
     }
   ).select("-password")

   return res
   .status(200)
   .json(
     new ApiResponse(200 ,user ,"cover image updated successfully " )
   )


})

// Controller function to fetch user's channel profile with subscriber counts and subscription status
// URL Parameter: username (the channel/user whose profile we want to fetch)
const getuserchannelprofile = asyncHandler(async(req, res)=>{
    // Extract username from URL parameters (req.params)
    // Example: GET /channel/johndoe → username = "johndoe"
    const {username} = req.params

    // VALIDATION: Check if username is provided and not empty
    // ?. = optional chaining (returns undefined if username doesn't exist, no error thrown)
    // .trim() = removes leading/trailing whitespace
    // if empty string → throw 400 Bad Request error
    if(!username?.trim()){
        throw new ApiError(400 , "username is missing")
    }
   // MongoDB Aggregation Pipeline to fetch user channel profile with subscriber information
   const channel = await User.aggregate([
    // STAGE 1: $match - Filter user by username (case-insensitive)
    // This finds the specific channel/user whose profile we want to fetch
    {
        $match:{
            username:username?.toLowerCase()  // Convert to lowercase for case-insensitive search
        }
    },

    // STAGE 2: $lookup - LEFT JOIN with subscription collection
    // Purpose: Find all subscribers of this channel
    // Logic: Match users whose subscription.channel field equals this user's _id
    // Result: Returns array of subscription documents in "subscribers" field
    {
        $lookup:{
            from:"subscription",           // Join with subscription collection
            localField:"_id",              // User's ID
            foreignField:"channel",        // Field in subscription where channel = this user's ID (these are people subscribing to this user)
            as:"subscribers"               // Store results in "subscribers" array
        }
    },

    // STAGE 3: $lookup - LEFT JOIN with subscription collection (second time)
    // Purpose: Find all channels that this user is subscribed to
    // Logic: Match subscriptions where subscription.subscriber field equals this user's _id
    // Result: Returns array of subscription documents in "subscribedto" field
    {
        $lookup:{
            from:"subscription",           // Join with subscription collection
            localField:"_id",              // User's ID
            foreignField:"subscriber",     // Field in subscription where subscriber = this user's ID (channels this user follows)
            as:"subscribedto"              // Store results in "subscribedto" array
        }
    },

    // STAGE 4: $addFields - Add computed/derived fields to document
    // This stage calculates counts and subscription status
    {
        $addFields:{
            // Count total number of subscribers this channel has
            subscribercount:{
                $size:"$subscribers"       // Get length of subscribers array
            },

            // Count total number of channels this user is subscribed to
            channelsubcribedtocount:{
                $size:"$subscribedto"      // Get length of subscribedto array
            },

            // Check if the current logged-in user (req.user._id) is subscribed to this channel
            // Returns true if found, false otherwise
            issubcribed:{
                $cond:{
                    // Check if current user's ID exists in this channel's subscribers list
                    if:{$in :[req.user?._id,"$subscribedto.subscriber"]},  // Look in subscribedto array's subscriber field
                    then:true,             // If found, user is subscribed
                    else:false             // If not found, user is not subscribed
                }
            }
        }
    },

    // STAGE 5: $project - Select only specific fields to return to client
    // This reduces data transfer and hides unnecessary information
    {
        $project:{
            fullname:1,                    // 1 = include this field
            username:1,                    // Include username
            subscribercount:1,             // Include subscriber count (computed field)
            channelsubcribedtocount:1,     // Include subscribed to count (computed field)
            issubcribed:1,                 // Include subscription status (computed field)
            avatar:1,                      // Include profile picture URL
            coverImage:1,                  // Include cover image URL
            email:1                        // Include email address
            // password and refreshToken are automatically excluded (not listed here)
        }
    }
   ])

   // ERROR HANDLING: Check if aggregation returned empty results
   // If channel array is empty (length = 0), user/channel doesn't exist
   if(!channel?.length){
     // Throw 404 Not Found error with custom message
     throw new ApiError(404 , "channel does not exists")
   }

   // SUCCESS RESPONSE: Send channel data back to client
   return res
   .status(200)                          // HTTP 200 - OK status
   .json(
    // ApiResponse wrapper with:
    // - statusCode: 200
    // - data: channel[0] (first/only result from aggregation pipeline)
    // - message: descriptive success message
    new ApiResponse(200 ,channel[0], "user channel fetched successfully")
   )
     
})

const getwatchhistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            //get user and match it 
            $match:{
                _id:new mongoose.Type.ObjectId(req.user._id)
            },

        },
        {  
            $lookup:{
                from:"vedios",// currently in user get from vedios
                localField: "watchhistory" ,// in user - watchhistory
                foreignField:"_id",// from vedios 
                as:"watchhistory" ,// save as 
                pipeline:[
                    {
                        $lookup:{
                            from:"user",
                            localField:"owner",// from vedios-inside it owner
                            foreignField:"_id",
                            as:"owner",  
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        ava
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])
})

export {  
          registeruser,  
          loginuser,
          logoutuser,
          refreshaccesstoken,
          changecurrentpassword,
          getcurrentuser,
          updateaccountdetails,
          updateuseravatar,
          updatecoverimage,
         getuserchannelprofile,
         getwatchhistory 
        
        };