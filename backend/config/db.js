import "dotenv/config";
import { Sequelize } from "sequelize";

export const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false} },
    sync: true,
    logging: false,
  }
);
