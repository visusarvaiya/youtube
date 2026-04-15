import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectdb = async() => {
    try{
        await mongoose.connect(``)

    }
    catch(error){
        console.log("mongodb connection error " + error);
        process.exit(1)
        
    }
}