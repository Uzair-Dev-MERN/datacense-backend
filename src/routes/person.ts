import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createGrandpa } from "../controllers/createFamily.controller";

const router = Router();

router.post("/createPerson", authenticate, createGrandpa); // To get user email

export default router;
