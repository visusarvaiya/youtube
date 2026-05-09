import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:{
        type:String,
        required:true
    },
       description:{
        type:String,
        required:true
    },
    v
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)