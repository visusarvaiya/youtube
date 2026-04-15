import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
{
    username:{
        type
    }        
},Timestamp)
export const User = mongoose.model("User",userSchema)