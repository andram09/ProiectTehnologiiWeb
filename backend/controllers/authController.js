import express from "express";
import sequelize from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
const JWT_SECRET = "secretkey";
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
};
