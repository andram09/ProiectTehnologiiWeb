import { Paper } from "../models/index.js";
import { Conference } from "../models/Conference.js";
import { Author } from "../models/Author.js";
import { User } from "../models/User.js";

export const controller = {
  createPaper: async (req, res) => {
    try {
      const { title, conferenceId, fileUrl, status } = req.body;

      if (!title || !conferenceId || !fileUrl) {
        return res.status(400).send("Nu am toate campurile necesare");
      }
      const conference = await Conference.findByPk(conferenceId);
      if (!conference) {
        return res.status(404).send("Conferinta cu id-ul dat nu exista");
      }
      const allowedStatus = ["UNDER_REVIEW", "ACCEPTED", "REJECTED"];
      if (status && !allowedStatus.includes(status)) {
        //daca e trimis statutusul trb sa verificam ca e valid, daca nu e trimis o sa devina by default under_review
        return res.status(400).send("Status invalid!");
      }
      if (title.length < 3)
        return res.status(400).send("Titlul trb sa aiba macar 3 caractere");
      const newPaper = await Paper.create({
        title,
        conferenceId,
        fileUrl,
        status: status, //nu mnai punem || pt ca deja avem default value in model
      });

      res.status(201).json(newPaper);
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
          model: Author,
          include: {
            model: User,
            attributes: ["id"],
          },
        },
      });

      if (papers.length === 0) {
        return res.status(404).send("Nu am gasit lucrari pentru autorul asta");
      }
      res.status(200).json(papers);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea tuturor lucrarilor ${err}`);
    }
  },

  updatePaper: async (req, res) => {
    try {
      const paperId = req.params.id;
      const { title, conferenceId, fileUrl, status } = req.body;
      const userRole = req.user.role;

      const paper = await Paper.findByPk(paperId);
      if (!paper) {
        return res.status(404).send("Nu am gasit lucrarea");
      }
      if (title !== undefined && title.length < 3) {
        return res.status(400).send("Titlul trebuie sa aiba minim 3 caractere");
      }
      const allowedStatus = ["UNDER_REVIEW", "ACCEPTED", "REJECTED"];
      if (status !== undefined && !allowedStatus.includes(status)) {
        //daca e trimis statutusul trb sa verificam ca e valid, daca nu e trimis o sa devina by default under_review
        return res.status(400).send("Status invalid!");
      }
      //conferenceId ar putea fi modificat de organiser? de verificat!
      if (userRole === "author") {
        await paper.update({
          title: title ?? paper.title,
          fileUrl: fileUrl ?? paper.fileUrl,
        });
      } else if (userRole === "reviewer") {
        await paper.update({
          status: status ?? paper.status,
        });
      } else {
        return res.status(403).send("Nu poti modifica aceasta lucrare");
      }

      res.status(200).json(paper);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea tuturor lucrarilor ${err}`);
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
};
