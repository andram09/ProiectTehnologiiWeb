import express from "express";
import { router as otherRouter } from "./other.js";

import { router as authorRouter } from "./Author.js";
import { router as paperRouter } from "./Paper.js";
import { router as conferenceRouter } from "./Conference.js";
import { router as reviewRouter } from "./Review.js";
import { router as userRouter } from "./User.js";
import { router as authRouter } from "./Auth.js";
import { router as conferenceAttendanceRouter } from "./ConferenceAttendance.js";

export const router = express.Router();
router.use("/", otherRouter);
router.use("/", authorRouter);
router.use("/", paperRouter);
router.use("/", conferenceRouter);
router.use("/", reviewRouter);
router.use("/", userRouter);
router.use("/", authRouter);
router.use("/", conferenceAttendanceRouter);
