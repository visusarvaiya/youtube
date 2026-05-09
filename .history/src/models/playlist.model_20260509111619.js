import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:{
        type:str
    }
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)