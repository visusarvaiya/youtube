import mongoose,{Schema} from "mongoose";
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
        type:String,
        required:true 
    },
    coverImage
      
           
},Timestamp)
export const User = mongoose.model("User",userSchema)  