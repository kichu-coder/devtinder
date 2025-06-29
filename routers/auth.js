import express from "express";
import { validateUserData } from "../helpers/utils.js";
import { User } from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";

export const authRouter = express.Router()

authRouter.post("/signUp", async (req, res) => {
  try {
    // validate user data
    validateUserData(req);

    const hassedPassword = await bcrypt.hash(req.body.password, 10);

    const { firstName, lastName, emailId } = req.body;

    const userBody = {
      firstName,
      lastName,
      emailId,
      password: hassedPassword,
    };

    // creating a new instance of a user model
    const user = new User(userBody);

    const result = await user.save();

    res.send(result);
  } catch (err) {
    res.status(400).send("Error Saving the User : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    let user = await User.findOne({ emailId: emailId })

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidUser = await user.validatePassword(password);

    if (!isValidUser) {
      res.status(400).send("Login failed!!!");
    } else {
      
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
      user = user.toJSON()
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie(
    "token" , null,
  {expires : new Date(Date.now())
  })

  res.send("Logout Successfull!!!")
})