import { ConferenceAttendance } from "../models/ConferenceAttendance.js";
import { User } from "../models/User.js";
import { Conference } from "../models/Conference.js";

export const controller = {
  addConferenceAttendace: async (req, res) => {
    try {
      const { userId, conferenceId } = req.body;

      if (!userId || !conferenceId) {
        return res.status(400).send("Nu am userId sau conferenceId");
      }
      //verific daca e deja inscris
      const exists = await ConferenceAttendance.findOne({
        where: { userId, conferenceId },
      });
      if (exists)
        return res
          .status(200)
          .send("User-ul e deja inscris la aceeasta conferinta");

      const attendance = await ConferenceAttendance.create({
        userId,
        conferenceId,
      });

      return res.status(201).send(attendance);
    } catch (err) {
      return res.status(500).send("Eraore la inscriere user: " + err);
    }
  },

  getConferenceAttendaceByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        include: {
          model: Conference,
          as: "attendedConferences",
          through: { attributes: [] },
        },
      });
      if (!user) return res.status(404).send("User nu exista");

      return res.status(200).send(user.attendedConferences);
    } catch (err) {
      return res
        .status(500)
        .send("Eraore preluare conferinte ale user-ului: " + err);
    }
  },
};
