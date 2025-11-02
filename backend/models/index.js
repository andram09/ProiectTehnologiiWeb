import {db} from '../config/db.js'

import {User  }from './User.js'
import { Review} from './Review.js'
import {Paper} from './Paper.js'
import { ConferenceAttendance } from './ConferenceAttendance.js'
import { Conference } from './Conference.js'
import { Author } from './Author.js'

//organizer -> conference
Conference.belongsTo(User, {as: "organiser", foreignKey: "organiserId"});
User.hasMany(Conference, {as: "organisedConferences", foreignKey: "organiserId"});

//conference_attendence
User.belongsToMany(Conference, {
    through: ConferenceAttendance,
    foreignKey: "userId",
    as: "attendedConferences",
});
Conference.belongsToMany(User, {
    through: ConferenceAttendance,
    foreignKey: "conferenceId",
    as: "participants",
});

//conference -> papers
Conference.hasMany(Paper, {foreignKey: "conferenceId"});
Paper.belongsTo(Conference, {foreignKey:"conferenceId"});

//authors
User.belongsToMany(Paper, {through: Author, foreignKey:"userId", as: "paperAuthored"});
Paper.belongsToMany(User, {through: Author, foreignKey:"paperId", as:"authors"});


//reviesws

User.hasMany(Review,{foreignKey:"userId",as:"reviewGiven"});
Review.belongsTo(User,{foreignKey:"userId",as:"reviewer"});

Paper.hasMany(Review,{foreignKey:"paperId",as:"paperReviews"});
Review.belongsTo(Paper,{foreignKey:"paperId"});

export {db,User,Conference,ConferenceAttendance,Paper,Author,Review};