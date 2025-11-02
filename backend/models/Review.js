import {db} from "../config/db.js"
import { DataTypes } from "sequelize";

export const Review=db.define('Review',{
id:{
    type:DataTypes.BIGINT,
    autoIncrement:true,
    primaryKey:true
},
feedback:{
    type:DataTypes.TEXT,
    allowNull:false
},
decision:{
    type:DataTypes.ENUM("APPROVED","REVISE","REJECT"),
    defaultValue:"REVISE"
},
isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
},
reviewer_id:{
    type:DataTypes.INTEGER,
    references:{
        model:"User",
        key:'id'
    },
    allowNull:false
}
},{
tableName:"review"})

