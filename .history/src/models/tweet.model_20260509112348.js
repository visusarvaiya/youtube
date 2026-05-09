import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        Schema.ty
    }
},{timestamps:true})

export const Tweet = mongoose.model("Tweet",tweetSchema)