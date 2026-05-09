import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
  
   content:{
     type:String,
   }
})

commentSchema.plugin(mongooseAggregatePaginate)
export const comment = mongoose.model("Comment",commentSchema)