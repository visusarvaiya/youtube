import { Router } from "express";
import { registeruser } from "../controllers/user.controllers";
const router = Router()
router.route("/register").post(registeruser)
export default router