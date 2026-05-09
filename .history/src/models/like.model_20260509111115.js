import mongoose,{Schema} from "mongoose";
const likeSchema = new Schema ({
    vedio:{
        type:Schema.Types.ObjectId,
        ref:"Vedio"
    },
    

},{timestamps:true})