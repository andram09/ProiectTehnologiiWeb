import { DataTypes } from "sequelize";
import {db} from "../config/db.js"

export const Author=db.define("Author",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    isMainAuthor:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    tableName:"author",
})