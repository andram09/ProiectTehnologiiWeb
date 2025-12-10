import { Conference, User } from "../models/index.js";

export const controller = {
  createConference: async (req, res) => {
    try {
      const { title, date, time, location, description, organiserId } =
        req.body;
      if (
        !title ||
        !description ||
        !organiserId ||
        !date ||
        !time ||
        !location
      ) {
        return res.status(400).json({ error: "All fields must be completed!" });
      }
      if (title.length < 3) {
        return res.status(400).send("Title must be at least 3 characters long");
      }
      if (description.length < 10) {
        return res
          .status(400)
          .send("Description must be at least 10 characters long");
      }
      if (location.length < 3) {
        return res
          .status(400)
          .json({ error: "Location must be at least 3 characters long" });
      }
      //nu mai verific data si ora ca daca facem n frontend cu input special pt date si pt time ar trb sa fie ok

      const organiser = await User.findByPk(organiserId);
      if (!organiser) return res.status(404).send("Organiser doesnt exist");
      const newConference = await Conference.create({
        title,
        date,
        time,
        location,
        description,
        organiserId,
      });
      return res.status(201).json(newConference);
    } catch (error) {
      console.log("Error creating conference!");
      return res.status(500).send(`Can't create conference : ${error}`);
    }
  },

  getAllConferences: async (req, res) => {
    try {
      const conferences = await Conference.findAll({
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["id", "name", "email", "role"],
            through: { attributes: [] },
          },
        ],
      });

      if (conferences.length === 0) {
        return res.status(404).json("Failed to fetch conferences!");
      }
      const result = conferences.map((conf) => ({
        id: conf.id,
        title: conf.title,
        date: conf.date,
        time: conf.time,
        location: conf.location,
        description: conf.description,
        reviewersCount: conf.participants.filter((u) => u.role === "REVIEWER")
          .length,
        participants: conf.participants,
      }));
      return res.status(200).json(result);
    } catch (error) {
      console.log("Couldn't fetch conferences!" + error);
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
      if (
        updatedConference.title !== undefined &&
        updatedConference.title.length < 3
      ) {
        return res.status(400).send("Title must be at least 3 characters long");
      }

      if (
        updatedConference.description !== undefined &&
        updatedConference.description.length < 10
      ) {
        return res
          .status(400)
          .send("Description must be at least 10 characters long");
      }

      if (
        updatedConference.location !== undefined &&
        updatedConference.location.length < 3
      ) {
        return res
          .status(400)
          .send("Location must be at least 3 characters long");
      }
      if (updatedConference.organiserId) {
        //daca schimbam si organizatoru verificam ca exista id ul ala inainte
        const organiser = await User.findByPk(updatedConference.organiserId);
        if (!organiser) {
          return res.status(404).send("Organiser doesnt exist");
        }
      }
      const [updatedRows] = await Conference.update(updatedConference, {
        where: {
          id: conferenceId,
        },
      });
      if (updatedRows === 0) {
        return res.status(404).send(`Conference not found to be updated`);
      }
      return res.status(200).send(updatedConference);
    } catch (error) {
      return res.status(500).send(`Error while updating conference: ${error}`);
    }
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
