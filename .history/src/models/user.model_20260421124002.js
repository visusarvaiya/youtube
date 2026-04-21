import mongoose,{Schema} from "mongoose";
import jwt from"jsonwebtoken";
import bcrypt from 
const userSchema = new Schema(
{
    username:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
        index:true // optimiszed searching

    },
    email:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
      
    },
     fullname:{
        type:String,
        required:true, 
        trim:true,
        index:true // optimiszed searching

    },
    avatar:{
        type:String,// cloudinary url
        required:true 
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Vedio"// export "Vedios"
    }],
    password:{
        type:String,
        required:[true , 'password is required ']
    },
    refreshToken:{
        type:String
    }
         
      
           
},
{
    Timestamps : true 
}
)
export const User = mongoose.model("User",userSchema)  