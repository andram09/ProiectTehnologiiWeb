import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";

router.post("/register", controllers.authController.addUser);
router.post("/login", controllers.authController.loginUser);

router.post(
  "/updatePass",
  verifyToken,
  controllers.authController.updatePassword
);
router.post("/forgot-password", controllers.authController.forgotPassword);
router.post("/reset-password", controllers.authController.resetPassword);
