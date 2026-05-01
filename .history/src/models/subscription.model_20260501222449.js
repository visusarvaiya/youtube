import mongoose ,{Schema} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber
})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)