import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,//“Only allow requests from this frontend URL
    credentials:true //This is VERY IMPORTANT when using cookies or authentication
}))
export { app }