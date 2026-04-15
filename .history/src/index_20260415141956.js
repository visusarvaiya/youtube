import connectdb from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./.env'
})

connectdb()
.then(()=>{
    app.listen
})
.catch((error)=>{
    console.log("mongodb connection fail" +  error);
})
    
