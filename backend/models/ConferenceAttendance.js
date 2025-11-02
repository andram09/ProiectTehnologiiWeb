import {DataTypes} from "sequelize"
import {db} from "../config/db.js"

export const ConferenceAttendance=db.define("ConferenceAttendance",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
    },
    {
        tableName:"conference_attendance"
    }
);