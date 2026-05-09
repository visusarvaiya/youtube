import mongoose,{Schema} from "mongoose";\

const playlistSchema = new Schema({
    name:{
        type:String,
        required:true
    },
       des:{
        type:String,
        required:true
    },
    
},{timestamps:true})

export const Playlist = mongoose.model("Playlist",playlistSchema)