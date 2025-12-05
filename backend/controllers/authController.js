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
    if (!name || !email || !password || !role)
      return res.status(400).send("Toate campurile sunt obligatorii");
    try {
      const result = await User.findOne({
        where: { email: email },
      });
      if (result) {
        return res.status(409).json(`Email ul: ${email} este deja folosit!`);
      }
      if (!/^[a-zA-Z\s]{3,}$/.test(name)) {
        //minim 3 caractere si doar litere mici si mari
        res
          .status(400)
          .send("Numele trb sa aiba minim 3 caractere si sa aiba doar litere");
      }
      if (!/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        res.status(400).send("Email invalid");
      } //traducere: mail-ul poate avea litere mici+mari +cifre + punct _-, dupa @ dupa litere mici mari+cifre si . -, dupa . si minim 2 litere pt domeniu: .com .ro
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialCh = /[/!@#$%^&*()_\-+={}|\\:;"'<,>.?~`]/.test(password);
      const isLongEnough = password.length > 8;
      if (!hasUpperCase || !hasNumber || !hasSpecialCh || !isLongEnough) {
        res.status(400).send("Parola invalida");
      } //de afisat n front ce e gresit si ce trebuie sa modifice userul in formular
      const roles = ["ORGANIZER", "AUTHOR", "REVIEWER"];
      if (!roles.includes(role)) {
        res.status(400).send("Rol invalid");
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
      return res.status(400).send("Specifica email-ul si parola"); //nu cred ca mai trebuie alte validari aici
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
      const arePasswordsIdentical = await bcrypt.compare(
        password,
        user.password
      );

      if (arePasswordsIdentical) {
        res
          .status(400)
          .send("Noua parola trebuie sa fie diferita de cea veche~");
      }
      //validare parola noua
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialCh = /[/!@#$%^&*()_\-+={}|\\:;"'<,>.?~`]/.test(password);
      const isLongEnough = password.length > 8;
      if (!hasUpperCase || !hasNumber || !hasSpecialCh || !isLongEnough) {
        res.status(400).send("Parola invalida");
      }

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
      if (!email) return res.status(400).send("Mentionati un email valid");
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
      if (!token) {
        return res.status(400).send("Token lipsa");
      }
      const arePasswordsIdentical = await bcrypt.compare(
        password,
        user.password
      );

      if (arePasswordsIdentical) {
        res
          .status(400)
          .send("Noua parola trebuie sa fie diferita de cea veche~");
      }
      //validare parola noua
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialCh = /[/!@#$%^&*()_\-+={}|\\:;"'<,>.?~`]/.test(password);
      const isLongEnough = password.length > 8;
      if (!hasUpperCase || !hasNumber || !hasSpecialCh || !isLongEnough) {
        res.status(400).send("Parola invalida");
      }
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

      const validToken = await bcrypt.compare(
        tokenInput,
        resetToken.token_hash
      );
      if (!validToken) return res.status(400).send("Token invalid!");

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
