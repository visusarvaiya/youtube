import mongoose,{Schema} from "mongoose";
const userSchema = new Schema({},Timestamp)
export const User = mongoose.model("User",userSchema)