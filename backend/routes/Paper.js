import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";

router.post("/createPaper", controllers.paperController.createPaper);

router.get("/Papers", controllers.paperController.getAllPapers);

router.get(
  "/PapersByAuthor/:id",
  controllers.paperController.getAllPapersByAuthor
);

router.get(
  "/PapersByConference/:id",
  controllers.paperController.getPapersByConferenceId
);

router.put("/updatePaper/:id", controllers.paperController.updatePaper);

router.delete("/deletePaper/:id", controllers.paperController.deletePaperById);
