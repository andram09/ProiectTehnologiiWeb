import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";
import { allowRoles } from "../middleware/auth/roleMiddleware.js";

router.get(
  "/Authors",
  verifyToken,
  allowRoles("AUTHOR", "ORGANIZER"),
  controllers.authorController.getAllAuthors
);
router.get("/Authors/:id", controllers.authorController.getAuthorsByPaperId);
router.delete(
  "/deleteAuthor/:id",
  verifyToken,
  allowRoles("ORGANIZER"),
  controllers.authorController.deleteAuthorById
);
