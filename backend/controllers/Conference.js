import { Conference } from "../models/Conference.js";

export const controller = {
  createConference: async (req, res) => {
    try {
      const { title, description, organiserId } = req.body;
      if (!title || !description || !organiserId) {
        return res.status(400).json({ error: "All fields must be completed!" });
      }
      const newConference = await Conference.create({
        title,
        decription,
        organiserId,
      });
      return rs.status(201).json(newConference);
    } catch (error) {
      console.log("Error creating conference!");
      return res.status(500).send(`Can't create conference : ${error}`);
    }
  },

  getAllConferences: async (req, res) => {
    try {
      const conferences = await Conference.findAll({
        attributes: ["id", "title", "description", "organiserId"],
      });
      if (conferences.length === 0) {
        return res.status(404).json("Failed to fetch conferences!");
      }
      return res.status(200).json(conferences);
    } catch (error) {
      console.log("Couldn't fetch conferences!");
      return res.status(500).send(`Couldn't fetch conferences:${error}`);
    }
  },

  getConferenceById: async (req, res) => {
    try {
      const conferenceId = req.params.id;
      const conference = await Conference.findByPk(conferenceId);
      if (!conference) {
        return res.status(404).json("Failed to fetch conferences!");
      }
      return res.status(200).json(conference);
    } catch (error) {
      console.log("Couldn't fetch conference!");
      return res.status(500).send(`Couldn't fetch conference:${error}`);
    }
  },
  deleteConferenceById: async (req, res) => {
    try {
      const conferenceId = req.params.id;
      const deletedRows = await Conference.destroy({
        where: {
          id: conferenceId,
        },
      });
      if (deletedRows === 0) {
        return res.status(404).send(`Conference not found!`);
      }
      return res.status(200).send(`Deleted the conference`);
    } catch (error) {
      console.log("Error deleting the conference:", error);
      return res
        .status(500)
        .send(`Error while deleting the conference : ${error}`);
    }
  },
  updateConferenceById: async (req, res) => {
    try {
      const conferenceId = req.params.id;
      const updatedConference = req.body;
      const [updatedRows] = await Conference.update(updatedConference, {
        where: {
          id: conferenceId,
        },
      });
      if (updatedRows === 0) {
        return res.status(404).send(`Conference not found to be updated`);
      }
      return res.status(200).send(updatedConference);
    } catch (error) {}
  },
  getAllConferenceByOrganiserId: async (req, res) => {
    try {
      const id = req.params.id;
      const conferences = await Conference.findAll({
        where: {
          organiserId: id,
        },
      });
      if (conferences.length === 0) {
        return res.status(404).send(`No conferecences where found`);
      }
      return res.status(200).send(conferences);
    } catch (error) {
      console.log("Couldn't fetch conference!");
      return res.status(500).send(`Couldn't fetch conference:${error}`);
    }
  },
};
