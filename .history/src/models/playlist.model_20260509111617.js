import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:{
        type:
    }
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)