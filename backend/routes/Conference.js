import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";
import { allowRoles } from "../middleware/auth/roleMiddleware.js";

router.get("/Conferences", controllers.conferenceController.getAllConferences);
router.get(
  "/Conferences/:id",
  controllers.conferenceController.getConferenceById
);
router.get(
  "/organiserConference/:id",
  verifyToken,
  allowRoles("ORGANIZER"),
  controllers.conferenceController.getAllConferenceByOrganiserId
);
router.delete(
  "/deleteConference/:id",
  verifyToken,
  allowRoles("ORGANIZER"),
  controllers.conferenceController.deleteConferenceById
);
router.post(
  "/createConference",
  verifyToken,
  allowRoles("ORGANIZER"),
  controllers.conferenceController.createConference
);
router.put(
  "/updateConference/:id",
  verifyToken,
  allowRoles("ORGANIZER"),
  controllers.conferenceController.updateConferenceById
);
