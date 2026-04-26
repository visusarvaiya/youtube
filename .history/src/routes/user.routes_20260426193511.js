import { Router } from "express";
import { registeruser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares"


const router = Router()
router.route("/register").post(registeruser);
export default router;