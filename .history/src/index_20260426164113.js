import connectdb from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({
    path: './.env'
})

connectdb()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("mongodb connection fail" +  error);
})
    
