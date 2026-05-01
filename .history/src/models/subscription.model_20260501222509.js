import mongoose ,{Schema} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.T
    }
})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)