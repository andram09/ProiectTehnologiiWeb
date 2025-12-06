import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { Paper } from "../models/Paper.js";

export const controller = {
  createReview: async (req, res) => {
    try {
      const { feedback, decision, paperId, userId } = req.body;
      if (!feedback || !paperId || !userId)
        return res.status(400).send("Must complete all values!");

      if (feedback.length < 10) {
        return res
          .status(400)
          .send("Feedback-ul trebuia sa aiba minim 10 caractere");
      }
      const allowedDecisions = ["APPROVED", "REVISE", "REJECT"];
      if (decision !== undefined && !allowedDecisions.includes(decision)) {
        return res
          .status(400)
          .send("Este necesar sa specificati o decizie valida");
      }
      const paper = await Paper.findByPk(paperId);
      if (!paper) return res.status(404).send("Lucrarea nu exista");
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).send("Userul nu exista");
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
      const review = await Review.findByPk(reviewId);
      if (!review) return res.status(404).send("Review-ul nu exista!");
      if (
        updateData.feedback !== undefined &&
        updateData.feedback.length < 10
      ) {
        return res
          .status(400)
          .send("Feedback-ul trebuie sa aiba minim 10 caractere");
      }
      const allowedDecisions = ["APPROVED", "REVISE", "REJECT"];
      if (
        updateData.decision !== undefined &&
        !allowedDecisions.includes(updateData.decision)
      ) {
        return res.status(400).send("Decizie invalida");
      }
      if (
        updateData.isActive !== undefined &&
        typeof updateData.isActive !== "boolean"
      ) {
        return res.status(400).send("isActive trebuie sa fie true sau false");
      }
      review.set({
        feedback: updateData.feedback ?? review.feedback,
        decision: updateData.decision ?? review.decision,
        isActive: updateData.isActive ?? review.isActive,
      });
      await review.save();
      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send(`Eroare la update review: ${err}`);
    }
  },
};
