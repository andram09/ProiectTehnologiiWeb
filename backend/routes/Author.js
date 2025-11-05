import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";

router.get("/Authors", controllers.authorController.getAllAuthors);
router.get("/Authors/:id", controllers.authorController.getAuthorsByPaperId);
router.delete(
  "/deleteAuthor/:id",
  controllers.authorController.deleteAuthorById
);
