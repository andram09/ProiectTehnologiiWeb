import {DataTypes} from "sequelize"
import {db} from "../config/db.js"

export const Paper=db.define("Paper", 
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        title:{
            type:DataTypes.STRING,
            allowNull: false
        },
        fileUrl:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.ENUM("UNDER_REVIEW", "ACCEPTED", "REJECTED"),
            defaultValue: "UNDER_REVIEW"
        }
    },
    {tableName: "paper"}
);
