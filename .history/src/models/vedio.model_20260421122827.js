import mongoose,{Schema} from "mongoose";
import aggre
const vedioSchema = new Schema(
    {
        videoFile: {
            type: String, //  cloudinary url
            required: true
        },
        thumbnail: {
            type: String, // cloudinary url
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },{
        timestamps:true
    }
)

export const Vedio = mongoose.model("Vedio",vedioSchema)