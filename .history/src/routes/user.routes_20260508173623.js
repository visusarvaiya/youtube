import { Router } from "express";
import { loginuser, logoutuser, registeruser,refreshaccesstoken, changecurrentpassword, getcurrentuser, updateaccountdetails } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verify } from "jsonwebtoken";


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

router.route("/refresh-token").post(refreshaccesstoken)

router.route("/change-password").post(verifyJWT,changecurrentpassword)

router.route("/current-user").get(verifyJWT,getcurrentuser)

router.route("/update-account").patch(verifyJWT,updateaccountdetails)

router.route("/avatar").patch(verifyJWT,upload.)
export default router;

//👉 “This route accepts user registration with avatar & cover image upload,
//  processes files using Multer, then runs register logic.”