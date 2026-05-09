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
    vedi
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)