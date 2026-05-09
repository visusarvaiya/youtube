import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    conte
},{timestamps:true})

export const Tweet = mongoose.model("Tweet",tweetSchema)