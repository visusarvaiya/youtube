import mongoose ,{Schema} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel
})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)