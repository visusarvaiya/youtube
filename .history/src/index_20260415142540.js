import connectdb from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./.env'
})

connectdb()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server i running on port` + ${process.env.PORT})
    })
})
.catch((error)=>{
    console.log("mongodb connection fail" +  error);
})
    
