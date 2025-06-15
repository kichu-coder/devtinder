import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { connectDb } from "./config/database.js";
import { User } from "./models/user.js";
import bcrypt from "bcrypt";
import { validateUserData } from "./helpers/utils.js";
import validator from "validator";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();

app.use(cookieParser());

app.use(express.json()); // Built-in middleware in Express to parse JSON bodies

app.get(
  "/dummy",
  (req, res, next) => {
    console.log("frist function");
    // next()
  },
  (req, res) => {
    console.log("second function");
    res.send("Inside second function");
  }
);

app.post("/signUp", async (req, res) => {
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
    console.log(err);
    res.status(400).send("Error Saving the User : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidUser = await user.validatePassword(password);

    if (!isValidUser) {
      res.send("Login failed!!!");
    } else {
      
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.send("Login Successfull!!!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

app.post("/profile", authMiddleware, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

app.post("/sendConnectionRequest", authMiddleware, (req, res) => {
  //sending a connection request

  const user = req.user

  console.log("Sending connection request");

  res.send(user.firstName + " Connection request sent");
});

connectDb()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("server is listening in port 3000");
    });
  })
  .catch((err) => {
    console.log(`Database connection cannot be established ${err}`);
  });
