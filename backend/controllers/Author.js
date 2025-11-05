import { Author, User } from "../models/index.js";

export const controller = {
  getAllAuthors: async (req, res) => {
    try {
      const authors = await Author.findAll({
        include: {
          model: User,
          attributes: ["name"],
        },
      });
      if (!authors || authors.lenght === 0) {
        res.status(404).send("Could not find any authors");
      } else {
        res.status(200).json(authors);
      }
    } catch (err) {
      res.status(500).send(`Error while getting authors: ${err.message}`);
    }
  },
  getAuthorsByPaperId: async (req, res) => {
    try {
      const paperId = req.params.id;

      const authors = await Author.findAll({
        where: { paperId: paperId },
        include: {
          model: User,
          attributes: ["name"],
        },
      });
      if (!authors || authors.lenght === 0) {
        res.status(404).send("Could not find any authors ");
      }
      res.status(200).json(authors);
    } catch (err) {
      res.status(500).send(`Error while getting authors: ${err.message}`);
    }
  },
  deleteAuthorById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).send({ message: "An id must be specified!" });
      }
      const author = await Author.findByPk(id);
      if (author) {
        await author.destroy();
        res.status(202).send(`Author succesfully deleted`);
      } else {
        res.status(404).send(`The event doesnt exist`);
      }
    } catch (err) {
      res.status(500).send(`Error while deleting: ${err.message}`);
    }
  },
};
