import { db } from "../config/db.js";

import { User } from "./User.js";
import { Review } from "./Review.js";
import { Paper } from "./Paper.js";
import { ConferenceAttendance } from "./ConferenceAttendance.js";
import { Conference } from "./Conference.js";
import { Author } from "./Author.js";
import { ResetTokens } from "./reset_tokens.js";
import { PaperReviewer } from "./PaperReviewer.js";

ResetTokens.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
User.hasMany(ResetTokens, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

//organizer -> conference
Conference.belongsTo(User, {
  as: "organiser",
  foreignKey: "organiserId",
  onDelete: "CASCADE",
});
User.hasMany(Conference, {
  as: "organisedConferences",
  foreignKey: "organiserId",
  onDelete: "CASCADE",
});

//conference_attendence
User.belongsToMany(Conference, {
  through: ConferenceAttendance,
  foreignKey: "userId",
  as: "attendedConferences",
  onDelete: "CASCADE",
});
Conference.belongsToMany(User, {
  through: ConferenceAttendance,
  foreignKey: "conferenceId",
  as: "participants",
  onDelete: "CASCADE",
});

//conference -> papers
Conference.hasMany(Paper, { foreignKey: "conferenceId", onDelete: "CASCADE" });
Paper.belongsTo(Conference, {
  foreignKey: "conferenceId",
  onDelete: "CASCADE",
});

//authors
User.belongsToMany(Paper, {
  through: Author,
  foreignKey: "userId",
  as: "paperAuthored",
  onDelete: "CASCADE",
});
Paper.belongsToMany(User, {
  through: Author,
  foreignKey: "paperId",
  as: "authors",
  onDelete: "CASCADE",
});

//paper-author-user
Author.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Author.belongsTo(Paper, { foreignKey: "paperId", onDelete: "CASCADE" });

//reviesws

User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviewGiven",
  onDelete: "CASCADE",
});
Review.belongsTo(User, {
  foreignKey: "userId",
  as: "reviewer",
  onDelete: "CASCADE",
});

Paper.hasMany(Review, {
  foreignKey: "paperId",
  as: "paperReviews",
  onDelete: "CASCADE",
});
Review.belongsTo(Paper, { foreignKey: "paperId", onDelete: "CASCADE" });

//paper_reviewer
User.belongsToMany(Paper, {
  through: PaperReviewer,
  foreignKey: "userId",
  as: "assignedPapers",
  onDelete: "CASCADE",
});

Paper.belongsToMany(User, {
  through: PaperReviewer,
  foreignKey: "paperId",
  as: "assignedReviewers",
  onDelete: "CASCADE",
});

export {
  db,
  User,
  Conference,
  ConferenceAttendance,
  Paper,
  Author,
  Review,
  ResetTokens,
  PaperReviewer,
};
