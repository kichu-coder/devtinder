import express from "express"
import { authMiddleware } from "../middlewares/auth.js";
import { validateEditRequest } from "../helpers/utils.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { connectionRequestModel } from "../models/connectionrequest.js";

export const userRouter = express.Router();

// const USER_SAFE_DATA  = ["firstName","lastName","age","gender","photoUrl","about","skills"]

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills"

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
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA).lean();

    let data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });

  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

userRouter.post("/feed", authMiddleware, async (req, res) => {
  try {

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 5;

    limit = limit > 50 ? 50 : limit; 

    const intrestedOrignoredUsersConnections = await connectionRequestModel.find({
      $or : [
        {fromUserId : loggedInUser._id},
        {toUserId : loggedInUser._id}
      ]
    }).select("fromUserId toUserId -_id")

    const hideUsersFromFeed = new Set();

    intrestedOrignoredUsersConnections.forEach((connection) => {
        hideUsersFromFeed.add(connection.fromUserId.toString());
        hideUsersFromFeed.add(connection.toUserId.toString());
    })
   
    const feedUsers = await User.find({
      $and : [
        {_id : {$ne : loggedInUser._id}},
        {_id : {$nin : Array.from(hideUsersFromFeed) }}
      ]
    }).select(USER_SAFE_DATA).skip((page-1) * limit).limit(limit)

    res.json({data : feedUsers}) 

  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

