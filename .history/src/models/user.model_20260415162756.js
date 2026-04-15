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
     name:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
        index:true // optimiszed searching

    }    
      
           
},Timestamp)
export const User = mongoose.model("User",userSchema)  