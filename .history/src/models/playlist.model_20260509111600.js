import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({},{timestamps:true})

export const Plalist = mongoose.model("Playlist",playlistSchema)