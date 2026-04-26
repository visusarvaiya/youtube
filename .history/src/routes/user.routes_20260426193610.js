import { Router } from "express";
import { registeruser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()
router.route("/register").post(upload.fields()
registeruser);
export default router;