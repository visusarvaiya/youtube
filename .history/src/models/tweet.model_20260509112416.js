import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        Schema.Types.ObjectId,
        ref

    }
},{timestamps:true})

export const Tweet = mongoose.model("Tweet",tweetSchema)