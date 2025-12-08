import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";
import { allowRoles } from "../middleware/auth/roleMiddleware.js";

router.get("/user/:id", verifyToken, controllers.userController.getUserById);
router.get("/users", controllers.userController.getAllUsers); //nu o fol nicaieri
router.get(
  "/reviewers",
  verifyToken,
  allowRoles("ORGANIZER"),
  controllers.userController.getAllReviewers
);
router.put("/user/:id", verifyToken, controllers.userController.updateUser);
router.delete(
  "/user/:id",
  verifyToken,
  controllers.userController.deleteUserById
);
