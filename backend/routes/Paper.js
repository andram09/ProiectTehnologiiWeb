import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";
import { allowRoles } from "../middleware/auth/roleMiddleware.js";

router.post(
  "/createPaper",
  verifyToken,
  allowRoles("AUTHOR"),
  controllers.paperController.createPaper
);

router.get(
  "/Papers",
  verifyToken,
  allowRoles("ORGANIZER", "REVIEWER"),
  controllers.paperController.getAllPapers
);

router.get(
  "/PapersByAuthor/:id",
  verifyToken,
  allowRoles("AUTHOR", "ORGANIZER"),
  controllers.paperController.getAllPapersByAuthor
);

router.get(
  "/PapersByConference/:id",
  controllers.paperController.getPapersByConferenceId
);

router.put(
  "/updatePaper/:id",
  verifyToken,
  allowRoles("AUTHOR"),
  controllers.paperController.updatePaper
);

router.delete(
  "/deletePaper/:id",
  verifyToken,
  allowRoles("AUTHOR"),
  controllers.paperController.deletePaperById
);
