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

/*<form method="POST">
  <input name="username" />
</form> to */
/* this req.body = {
  username: "visu"
}  ................
  ✅ extended: true
Allows complex data (objects, arrays)

user[name]=visu&user[age]=20

Becomes:

req.body = {
  user: { name: "visu", age: 20 }
}*/

app.use(express.static("public"))
/*👉 Serves static files (no backend logic needed)

Files inside public/ folder:image css js*/

app.use(cookieParser())
/*Reads cookies from browser request
 you cant easily read cookies 
 Browser sends:

Cookie: user=visu; token=123

Backend gets:

req.cookies = {
  user: "visu",
  token: "123"
}*/



// routes import
import userrouter from './routes/user.routes.js'


//routes declaration 
app.use("/api/v1/user", )

export { app }