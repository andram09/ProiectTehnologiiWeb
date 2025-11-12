import { Sequelize, DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ORGANIZER", "AUTHOR", "REVIEWER"),
      allowNull: false,
    },
  },
  {
    tableName: "`user`",
    timestamps: true,
  }
);

// User.authenticate = async function (email, password) {
//   const user = await User.findOne({ where: { email: email } });
//   const res = await bcrypt.compare(password, user.password);
//   if (res) {
//     return user.authorize;
//   }
// };
