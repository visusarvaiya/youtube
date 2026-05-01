import mongoose ,{Schema} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber:{
        type:Sche
    }
})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)