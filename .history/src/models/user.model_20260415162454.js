import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    usernam        
},Timestamp)
export const User = mongoose.model("User",userSchema)