import { Sequelize, DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const ResetTokens = db.define(
  "ResetTokens",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: "reset_tokens", freezeTableName: true, timestamps: false }
);
