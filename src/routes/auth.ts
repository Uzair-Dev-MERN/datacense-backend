import { Router } from "express";
import { getProfile, login, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/getprofile", authenticate, getProfile); // To get user email
router.post("/register", register);
router.post("/login", login);

export default router;
