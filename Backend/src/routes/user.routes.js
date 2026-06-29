import express from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", authController.registerUserController);
router.post("/login", authController.loginUserController);
router.post("/refresh-token", authController.refreshTokenController);
router.post("/logout", authController.logoutController);
router.post("/logoutall", authController.logoutAllController);
router.get("/get-me", authMiddleware, authController.getUser);

export default router;
