import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send("Lipseste token-ul pt auth");

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Token invalid!!");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Token expurat sau invalid");
  }
};
