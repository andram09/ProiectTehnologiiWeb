import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";

router.get("/Conferences", controllers.conferenceController.getAllConferences);
router.get(
  "/Conferences/:id",
  controllers.conferenceController.getConferenceById
);
router.get(
  "/Conference/:organiser",
  controllers.conferenceController.getAllConferenceByOrganiserId
);
router.delete(
  "/deleteConference/:id",
  controllers.conferenceController.deleteConferenceById
);
router.post(
  "/createConference",
  controllers.conferenceController.createConference
);
router.put(
  "/updateConference/:id",
  controllers.conferenceController.updateConferenceById
);
