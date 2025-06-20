import express from "express"
import { authMiddleware } from "../middlewares/auth.js";
import { validateEditRequest } from "../helpers/utils.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { connectionRequestModel } from "../models/connectionrequest.js";

export const userRouter = express.Router();

const USER_SAFE_DATA  = ["firstName","lastName","age","gender","photoUrl","about","skills"]

userRouter.post("/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel.find({toUserId : loggedInUser._id, 
      status : "interested"
    }).populate(
      "fromUserId",
      USER_SAFE_DATA
    );

    res.send(connectionRequests)

  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

userRouter.post("/connections", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel.find({
      $or : [
        {toUserId : loggedInUser._id},
        {fromUserId : loggedInUser._id}
      ],
      status : "accepted"
    }).populate("fromUserId", USER_SAFE_DATA)

    res.send(connectionRequests)

  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

