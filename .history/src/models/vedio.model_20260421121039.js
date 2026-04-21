import mongoose,{Schema} from "mongoose";
const vedioSchema = new Schema(
    {

    },{
        timestamps:true
    }
)

export const Vedio = mongoose.model("Vedio",vedioSchema)