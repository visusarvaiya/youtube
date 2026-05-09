import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:{
        type:String,
        re
    }
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)