import express from "express";
import { router as otherRouter } from "./other.js";

import { router as authorRouter } from "./Author.js";
import { router as paperRouter } from "./Paper.js";
import { router as conferenceRouter } from "./Conference.js";
import {router as reviewRouter} from "./Review.js";

export const router = express.Router();
router.use("/", otherRouter);
router.use("/", authorRouter);
router.use("/", paperRouter);
router.use("/", conferenceRouter);
router.use("/",reviewRouter);