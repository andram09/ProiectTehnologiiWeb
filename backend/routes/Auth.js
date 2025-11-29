import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";

router.post("/register", controllers.authController.addUser);
router.post("/login", controllers.authController.loginUser);
router.post("/updatePass", controllers.authController.updatePassword);
router.post("/forgot-password", controllers.authController.forgotPassword);
router.post("/reset-password", controllers.authController.resetPassword);
