import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Vedio } from "./vedio.model";

const commentSchema = new Schema({
  
   content:{
     type:String,
     required:true
   },
   vedio:{
    type:Schema.Types.ObjectId,
    ref:"Vedio"
   },
   owner:{
    type:Schema.Types.ObjectId,
    ref:""
   }
})

commentSchema.plugin(mongooseAggregatePaginate)
export const comment = mongoose.model("Comment",commentSchema)