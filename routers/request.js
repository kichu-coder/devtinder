import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { connectionRequestModel } from "../models/connectionrequest.js";

export const requestRouter = express.Router();

requestRouter.post(
  "/send/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    //sending a connection request
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (!["ignore", "interested"].includes(status)) {
        return res.json({ message: "not a valid status" });
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.send({
          message: "Connection request already exists",
          data: existingConnectionRequest,
        });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.json({
        message: "Connection Request sent successfully",
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

requestRouter.post(
  "/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status;

      if (!["accepted", "rejected"].includes(status)) {
        return res.json({ message: "Status is not valid" });
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
       _id : requestId,
       toUserId : loggedInUser._id,
       status : "interested"
      })

      if(!existingConnectionRequest){
        return res.json({ message: "No existing connection Request to accept or reject" });
      }

      existingConnectionRequest.status = status;

      await existingConnectionRequest.save();

      res.json({message : "User connection status is updated to : " + status})
    } catch (err) {
      res.json({message : "Error : " + err})
    }
  }
);
