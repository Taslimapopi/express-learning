import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.loginUser);

router.post("/generate-token", authController.generateToken);

export const authRoute = router;
