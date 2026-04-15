import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:,
        index:true
    }        
},Timestamp)
export const User = mongoose.model("User",userSchema)