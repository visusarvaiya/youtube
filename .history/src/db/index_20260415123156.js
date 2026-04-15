import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectdb = async() => {
    try{
       const connectioninstance=  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("mongodb connected !! HOST :" + ${ })

    }
    catch(error){
        console.log("mongodb connection error " + error);
        process.exit(1)
        
    }
}