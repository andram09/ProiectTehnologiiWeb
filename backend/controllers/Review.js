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
      let { feedback, decision } = req.body;
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).send("Review-ul nu exista!");
      }
      if (decision === "APPROVED") {
        if (!feedback || feedback.length < 10) {
          feedback = "Paper approved. No revisions required.";
        }
      }
      if (feedback && feedback.length < 10) {
        return res
          .status(400)
          .send("Feedback-ul trebuie sa aiba minim 10 caractere");
      }
      const allowedDecisions = ["APPROVED", "REVISE", "REJECT"];
      if (decision && !allowedDecisions.includes(decision)) {
        return res.status(400).send("Decizie invalida");
      }

      await review.update({
        feedback: feedback ?? review.feedback,
        decision: decision ?? review.decision,
      });
      const allReviews = await Review.findAll({
        where: {
          paperId: review.paperId,
          isActive: true,
        },
      });
      const placeholderTexts = [
        "Review pending initiation...",
        "Updated version - Review pending...",
      ];
      const allFinished = allReviews.every(
        (r) => !placeholderTexts.includes(r.feedback) && r.feedback.length >= 10
      );
      if (allFinished && allReviews.length >= 2) {
        const decisions = allReviews.map((r) => r.decision);

        let finalStatus = "REJECTED";

        const allApproved = decisions.every((d) => d === "APPROVED");

        const anyReject = decisions.some((d) => d === "REJECT");

        if (allApproved) {
          finalStatus = "ACCEPTED";
        } else if (anyReject) {
          finalStatus = "REJECTED";
        } else {
          finalStatus = "REJECTED";
        }
        await Paper.update(
          { status: finalStatus },
          { where: { id: review.paperId } }
        );

        console.log(`Paper ${review.paperId} auto-updated to ${finalStatus}`);
      }
      return res.status(200).send(review);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Err while updating");
    }
  },
};
