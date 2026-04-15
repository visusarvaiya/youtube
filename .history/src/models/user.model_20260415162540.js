import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    username:{
        type:String,
        required:,
        unique:,
        lowercase:,
        trim:,
        
    }        
},Timestamp)
export const User = mongoose.model("User",userSchema)