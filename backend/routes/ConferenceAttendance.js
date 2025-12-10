import express from "express";
import { controller } from "../controllers/ConferenceAttendance.js";

export const router = express.Router();

router.post("/attendance", controller.addConferenceAttendace);
router.get("/attendance/:userId", controller.getConferenceAttendaceByUserId);
