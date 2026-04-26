import { Router } from "express";
import { registeruser } from "../controllers/user.controllers.js";
import upload


const router = Router()
router.route("/register").post(registeruser);
export default router;