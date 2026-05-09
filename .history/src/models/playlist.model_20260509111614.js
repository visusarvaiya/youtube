import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:{
        ty
    }
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)