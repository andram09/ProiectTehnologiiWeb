import express from "express";
import { controllers } from "../controllers/index.js";

export const router=express.router();

router.post("/createReview",controllers.reviewController.createReview);
router.get("/reviewByReviewerId/:id",controllers.reviewController.getAllReviewsByReviewer);
router.get("/reviewByPaperId/:id",controllers.reviewController.getAllReviewsByPapaperId);
router.put("/reviewUpdate/:id",controllers.reviewController.updateReview)