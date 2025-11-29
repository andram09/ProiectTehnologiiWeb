import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ResetTokens } from "../models/reset_tokens.js";
import { transporter } from "../config/mail.js";
const JWT_SECRET = process.env.JWT_SECRET;
export const controller = {
  addUser: async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const result = await User.findOne({
        where: { email: email },
      });
      if (result) {
        return res.status(409).json(`Email ul: ${email} este deja folosit!`);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).send(`Server error: ${err}`);
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Specifica email-ul si parola");
    }
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) return res.status(404).send("Utilizatorul nu a fost gasit");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(404).send("Parola gresita");

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "2h",
      });
      res.status(200).send({ user, token });
    } catch (err) {
      res.status(500).send(`Server error: ${err}`);
    }
  },
  logoutUser: async (req, res) => {
    res.status(200).send("Deconectare efectuata?");
  },
  updatePassword: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email: email } });
      if (!user) return res.status(404).send("User not found");

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).send("Parola updatata cu succes!");
    } catch (err) {
      res.status(500).send(`Server error: ${err}`);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).send("Email-ul nu exista in baza de date");
      }

      const token = crypto.randomBytes(32).toString("hex"); //token de 64 de caractere
      const token_hash = await bcrypt.hash(token, 10);
      await ResetTokens.create({
        userId: user.id,
        token_hash: token_hash,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), //expira in 15 minute
      });
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user.id}`;

      const mailMessage = {
        from: `"Conference App"<${process.env.EMAIL_SEND}>`,
        to: user.email,
        subject: "Resetare parola",
        html: `
        <p>Salut ${user.name}</p>
        <p>Apasă pe linkul de mai jos pentru a-ți reseta parola: </p>
        <a href="${resetLink}">Resetare parola</a>
        <p>Linkul expira în 15 minute.</p>`,
      };
      await transporter.sendMail(mailMessage);
      res.status(200).send("Email de resetare trimis!");
    } catch (err) {
      console.log(err);
      return res.status(500).send(`Server errror:${err}`);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { id, token: tokenInput, newPassword } = req.body;
      const resetToken = await ResetTokens.findOne({
        where: { userId: id, used: false },
      });
      if (!resetToken) {
        return res
          .status(400)
          .send("Tokenul este invalid sau a fost deja folosit!");
      }
      if (new Date(resetToken.expires_at) < new Date()) {
        return res.status(400).send("Token expirat");
      }

      const valid = await bcrypt.compare(tokenInput, resetToken.token_hash);
      if (!valid) return res.status(400).send("Token invalid!");

      const user = await User.findByPk(id);
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      resetToken.used = true;
      await resetToken.save();
      return res.status(200).send("Parola a fost resetata !");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Eroare server!");
    }
  },
};
