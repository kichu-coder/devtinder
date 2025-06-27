import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { connectDb } from "./config/database.js";


import { validateUserData } from "./helpers/utils.js";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import {authRouter} from "./routers/auth.js";
import {requestRouter} from "./routers/request.js";
import {profileRouter} from "./routers/profile.js";
import {userRouter} from "./routers/user.js";
import cors from "cors"

const app = express();

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}));

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

app.use("/auth", authRouter);

app.use("/profile", profileRouter);

app.use("/request", requestRouter);

app.use("/user", userRouter);

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
