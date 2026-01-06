import { Paper } from "../models/index.js";
import { Conference } from "../models/Conference.js";
import { Author } from "../models/Author.js";
import { User } from "../models/User.js";
import { Review } from "../models/index.js";
import { ConferenceAttendance } from "../models/index.js";
import { db } from "../models/index.js";

export const controller = {
  createPaper: async (req, res) => {
    try {
      const { title, conferenceId, status } = req.body;
      const userId = req.user.id;

      if (!req.file) return res.status(400).send("No file uploaded");

      const newPaper = await Paper.create({
        title,
        conferenceId,
        fileUrl: req.file.path,
        status: status || "UNDER_REVIEW",
      });

      await Author.create({
        paperId: newPaper.id,
        userId: userId,
        isMainAuthor: true,
      });

      const exists = await ConferenceAttendance.findOne({
        where: { userId: userId, conferenceId },
      });
      if (!exists) {
        await ConferenceAttendance.create({ userId, conferenceId });
      }

      const reviewers = await User.findAll({
        where: { role: "REVIEWER" },
        order: db.random(),
        limit: 2,
      });

      await newPaper.addAssignedReviewers(reviewers);

      if (reviewers.length > 0) {
        const reviewPromises = reviewers.map((reviewer) => {
          return Review.create({
            userId: reviewer.id,
            paperId: newPaper.id,
            feedback: "Review pending initiation...",
            decision: "REVISE",
            isActive: true,
          });
        });
        await Promise.all(reviewPromises);
      }

      res.status(201).json({
        message: "Paper uploaded and reviewers assigned!",
        fileUrl: req.file.path,
      });
    } catch (err) {
      res.status(500).send(`Eroare la crearea lucrarii: ${err}`);
    }
  },

  getAllPapers: async (req, res) => {
    try {
      const papers = await Paper.findAll({
        include: [
          {
            model: Conference,
            attributes: ["id"],
          },
        ],
      });

      if (papers.length === 0) {
        return res.status(404).send("Nu am lucrari");
      }

      res.status(200).json(papers);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea tuturor lucrarilor ${err}`);
    }
  },
  getPaperById: async (req, res) => {
    try {
      const { id } = req.params;

      const paper = await Paper.findByPk(id, {
        include: [
          {
            model: User,
            as: "authors",
            attributes: ["id", "name", "email"],
            through: { attributes: [] },
          },
          {
            model: Conference,
            attributes: ["title"],
          },
        ],
      });

      if (!paper) {
        return res.status(404).send("Paper not found");
      }

      res.status(200).json(paper);
    } catch (err) {
      res.status(500).send(`Error fetching paper: ${err}`);
    }
  },

  getAllPapersByAuthor: async (req, res) => {
    try {
      const authorId = req.params.id;

      const papers = await Paper.findAll({
        include: [
          {
            model: User,
            as: "authors",
            where: { id: authorId },
            attributes: ["id", "name", "email"],
            through: { attributes: ["isMainAuthor"] },
          },
          { model: Conference, attributes: ["title"] },
        ],
      });

      if (papers.length === 0) {
        return res.status(404).send("Nu am gasit lucrari pentru autorul asta");
      }
      res.status(200).json(papers);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea tuturor lucrarilor ${err}`);
    }
  },
  getPapersByConferenceId: async (req, res) => {
    try {
      const conferenceId = req.params.id;

      const papers = await Paper.findAll({
        where: { conferenceId: conferenceId },
        include: {
          model: User,
          as: "authors",
          attributes: ["id", "name", "email"],
          through: {
            model: Author,
            attributes: [],
          },
        },
      });

      res.status(200).json(papers);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea tuturor lucrarilor ${err}`);
    }
  },

  updatePaper: async (req, res) => {
    try {
      const paperId = req.params.id;
      const { title, conferenceId } = req.body;
      const userRole = req.user.role.toUpperCase();

      const paper = await Paper.findByPk(paperId);
      if (!paper) return res.status(404).send("Paper not found");

      let newFileUrl = paper.fileUrl;
      if (req.file) {
        newFileUrl = req.file.path;
      }

      if (userRole === "AUTHOR") {
        // 1. update paper
        await paper.update({
          title: title ?? paper.title,
          conferenceId: conferenceId ?? paper.conferenceId,
          fileUrl: newFileUrl,
          status: "UNDER_REVIEW",
        });
        //punem pe isActive false review urile anterioare
        await Review.update(
          { isActive: false },
          { where: { paperId: paper.id, isActive: true } }
        );

        // 3. ia reviewerii asignati paperului
        const reviewers = await paper.getAssignedReviewers();

        // 4. creeaza review-uri NOI
        for (const reviewer of reviewers) {
          await Review.create({
            userId: reviewer.id,
            paperId: paper.id,
            feedback: "Updated version - review pending...",
            decision: "REVISE",
            isActive: true,
          });
        }
      }

      res.status(200).json(paper);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating paper");
    }
  },

  deletePaperById: async (req, res) => {
    try {
      const paperId = req.params.id;

      const deleted = await Paper.destroy({
        where: { id: paperId },
      });

      if (!deleted) {
        return res.status(404).send("Nu am gasit lucrarea");
      }

      res.status(200).send(`Lucrarea cu id-ul ${paperId} a fost stearsa!!`);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea tuturor lucrarilor ${err}`);
    }
  },

  getPapersAssignedToReviewer: async (req, res) => {
    try {
      const reviewerId = req.user.id;

      const reviewer = await User.findByPk(reviewerId, {
        include: {
          model: Paper,
          as: "assignedPapers",
          include: [
            {
              model: User,
              as: "authors",
              attributes: ["id", "name"],
            },
            {
              model: Review,
              as: "paperReviews",
              required: false,
              where: { userId: reviewerId },
            },
          ],
        },
      });

      if (!reviewer) return res.status(404).send("Reviewerul nu exista");

      res.status(200).json(reviewer.assignedPapers);
    } catch (err) {
      res.status(500).send(`Eroare la fetch assigned papers: ${err}`);
    }
  },
};
