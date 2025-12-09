import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/auth/verifyToken.js";
import { allowRoles } from "../middleware/auth/roleMiddleware.js";
import { upload } from "../middleware/uploadMulter.js";
router.post(
  "/createPaper",
  verifyToken,
  allowRoles("AUTHOR"),
  upload.single("file"),
  controllers.paperController.createPaper
);
//test

router.post("/test-upload", upload.single("file"), (req, res) => {
  console.log("TEST: req.file", req.file);
  if (req.file) {
    res.status(200).json({ message: "Test OK", fileDetails: req.file });
  } else {
    res.status(400).send("No file received from client");
  }
});

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

router.get(
  "/papersAssignedToMe/:id",
  verifyToken,
  allowRoles("REVIEWER"),
  controllers.paperController.getPapersAssignedToReviewer
);
