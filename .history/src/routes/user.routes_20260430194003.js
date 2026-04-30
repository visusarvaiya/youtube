import { Router } from "express";
import { loginuser, logoutuser, registeruser,refreshaccesstoken } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


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
router.route("/login").post(loginuser);

// secured routes
router.route("/logout").post(verifyJWT,logoutuser)//route → middleware → controller → logout.
export default router;


router.route("/refresh-token")

//👉 “This route accepts user registration with avatar & cover image upload,
//  processes files using Multer, then runs register logic.”