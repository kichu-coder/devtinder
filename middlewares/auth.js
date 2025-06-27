import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!!!")
    }

    const decodedMessage = jwt.verify(token, "kishorelovesneelima");

    const user = await User.findById({ _id: decodedMessage._id })

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
};
