import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    content:{
        type:String,
        
    }
},{timestamps:true})

export const Tweet = mongoose.model("Tweet",tweetSchema)