import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    content:{
        type:string
    }
},{timestamps:true})

export const Tweet = mongoose.model("Tweet",tweetSchema)