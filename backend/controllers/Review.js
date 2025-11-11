import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { Paper } from "../models/Paper.js";

export const controller = {
  createReview: async (req, res) => {
    try {
      const { feedback, decision, paperId, userId } = req.body;
      if (!feedback || !decision || !paperId || !userId)
        return res.status(400).send("Must complete all values!");
      const review = await Review.create({
        feedback,
        decision: decision || "REVISE",
        paperId,
        userId,
      });
      return res.status(201).send(review);
    } catch (err) {
      return res.status(500).send(`Eroare la creare review: ${err}`);
    }
  },
  getAllReviewsByReviewer: async (req, res) => {
    try {
      const reviewerId = req.params.id;
      const reviews = await Review.findAll({ where: { userId: reviewerId } });
      if (reviews.length === 0)
        return res.status(404).send("Nu am gasit reviewuri");
      return res.status(200).send(reviews);
    } catch (err) {
      return res.status(500).send(`Eroare la preluare review-uri: ${err}`);
    }
  },
  getAllReviewsByPaperId: async (req, res) => {
    try {
      const paperId = req.params.id;
      const reviews = await Review.findAll({ where: { paperId: paperId } });
      if (reviews.length === 0)
        return res.status(404).send("Nu am gasit reviewuri");
      return res.status(200).send(reviews);
    } catch (err) {
      return res.status(500).send(`Eroare la fetch review: ${err}`);
    }
  },
  updateReview: async (req, res) => {
    try {
      const reviewId = req.params.id;
      const updateData = req.body;
      const updatedRows = await Review.update({
        updateData,
        where: { id: reviewId },
      });
      if (updatedRows === 0) return res.status(404).send(`No data to update!`);
      const review = await Review.findByPk(reviewId);
      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send(`Eroare la update review: ${err}`);
    }
  }
};
