import express from "express";
import sequelize from "sequelize";
import cors from "cors";
import { router } from "./routes/index.js";
const app = express();

app.use(express.json());
const port = 8080;

app.use("/api", router);

app.listen(port, () => {
  console.log(`Aplicatia ruleaza pe portul http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Dar buna ziua!");
});
