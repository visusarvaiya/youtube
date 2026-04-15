import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    username:{
        type:String,
        required
    }        
},Timestamp)
export const User = mongoose.model("User",userSchema)