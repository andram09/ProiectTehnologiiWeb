import { db } from "../config/db.js";
import { DataTypes } from "sequelize";
export const PaperReviewer = db.define(
  "PaperReviewer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "paper_reviewer",
    timestamps: false,
  }
);
