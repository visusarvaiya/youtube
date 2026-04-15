import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    username:{
        type:String,
        required:,
        unique:
    }        
},Timestamp)
export const User = mongoose.model("User",userSchema)