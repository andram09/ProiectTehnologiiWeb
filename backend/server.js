import express from "express";
import sequelize from "sequelize";
import cors from "cors";
import dotenv from "dotenv";
import {db} from './models/index.js'
dotenv.config();
import { router } from "./routes/index.js";
const app = express();

const port = 8080;
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api", router);

await db.sync();
app.listen(port, () => {
  console.log(`Aplicatia ruleaza pe portul http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Dar buna ziua!");
});
