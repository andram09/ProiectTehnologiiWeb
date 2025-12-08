import express from "express";
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";
import { allowRoles } from "../middleware/auth/roleMiddleware.js";

export const router = express.Router();

router.post(
  "/createReview",
  verifyToken,
  allowRoles("REVIEWER"),
  controllers.reviewController.createReview
);
router.get(
  "/reviewByReviewerId/:id",
  verifyToken,
  allowRoles("REVIEWER"),
  controllers.reviewController.getAllReviewsByReviewer
);
router.get(
  "/reviewByPaperId/:id",
  verifyToken,
  allowRoles("REVIEWER", "AUTHOR"),
  controllers.reviewController.getAllReviewsByPaperId
);
router.put(
  "/reviewUpdate/:id",
  verifyToken,
  allowRoles("REVIEWER"),
  controllers.reviewController.updateReview
);
