import { User } from "../models/index.js";

export const controller = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      if (users.length === 0) {
        return res.status(404).send("Nu exista utilizatori");
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Eroare la preluarea userilor:${error} `);
    }
  },
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (user === null) {
        return res
          .status(404)
          .send("Nu exista utilizatorul cu id ul specificat!");
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send(`Eroare la preluarea userului: ${err}`);
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, role } = req.body;
      const user = await User.findByPk(userId);
      if (user === null) {
        return res.status(404).send("Nu am gasit userul specificat");
      }
      await user.update({ name, email, role });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send(`Eroare la updatarea userului:${err}`);
    }
  },
  deleteUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const deleted = await User.destroy({ where: { id: userId } });
      if (!deleted) {
        return res.status(404).send("Nu s-a gasit userul!");
      }
      res.status(200).send(`Userul cu id-ul specificat a fost sters`);
    } catch (err) {
      res.status(500).send(`Eroare la stergerea userului:${err}`);
    }
  },

  getAllReviewers: async (req, res) => {
    try {
      const reviewers = await User.findAll({
        where: { role: "reviewer" },
      });
      if (reviewers.length === 0) {
        return res.status(404).send("Nu s-au gasit useri cu rolul de reviewer");
      }
      return res.status(200).send(reviewrs);
    } catch (err) {
      res.status(500).send(`Eroare la preluare revieweri: ${err}`);
    }
  },
};
