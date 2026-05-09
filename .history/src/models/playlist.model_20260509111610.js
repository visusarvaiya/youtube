import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)