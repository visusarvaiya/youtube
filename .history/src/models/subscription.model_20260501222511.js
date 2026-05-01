import mongoose ,{Schema} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types
    }
})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)