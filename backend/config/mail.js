import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SEND,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
