import { DataTypes } from "sequelize";
import {db} from "../config/db.js"

export const Conference=db.define("Conference",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        title: {
            type: DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT
        },
    },
    {tableName: "conference"}
);