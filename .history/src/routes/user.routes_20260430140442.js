import { Router } from "express";
import { registeruser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()
router.route("/register").post(
upload.fields([
    {
        name :"avatar",
        maxCount:1
    },
    {
        name :"coverimage",
        maxCount:1
    }
]),
registeruser

);
router.route("/login").post(log)
export default router;

//👉 “This route accepts user registration with avatar & cover image upload,
//  processes files using Multer, then runs register logic.”