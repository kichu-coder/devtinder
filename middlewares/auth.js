import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Credentials");
    }

    const decodedMessage = jwt.verify(token, "kishorelovesneelima");

    const user = await User.findById({ _id: decodedMessage._id });

    if (!user) {
      throw new Error("User Not Found");
    }
    console.log(user);

    req.user = user;

    next();
  } catch (err) {
    res.send("Something went wrong : " + err.message);
  }
};
