import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    user        
},Timestamp)
export const User = mongoose.model("User",userSchema)