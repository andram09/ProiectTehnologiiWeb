import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

import express from "express";

import sequelize from "sequelize";
import cors from "cors";

import { db } from "./models/index.js";

import { router } from "./routes/index.js";
const app = express();

const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(express.static(path.join(__dirname, "dist")));

// app.get("(.*)", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// await db.sync();
// await db.sync({ force: true });
app.listen(port, () => {
  console.log(`Serverul ascultă pe portul ${port}`);
});
try {
  await db.authenticate();
  console.log("Conexiunea la Azure MySQL a fost stabilită cu succes.");
  await db.sync(); // Creează tabelele dacă nu există
} catch (error) {
  console.error("Nu s-a putut conecta la baza de date:", error);
}
