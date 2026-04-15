import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"//In Express.js, the cookie-parser middleware is used to read (parse) cookies sent by the client (browser) in HTTP requests.
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,//“Only allow requests from this frontend URL
    credentials:true //This is VERY IMPORTANT when using cookies or authentication
}))

app.use(express.json({limit : "16kb" }))//“Accept JSON data from client, but only up to 16KB size”
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use
export { app }