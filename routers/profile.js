import express from "express"
import { authMiddleware } from "../middlewares/auth.js";
import { validateEditRequest } from "../helpers/utils.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const profileRouter = express.Router();

profileRouter.post("/view", authMiddleware, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

profileRouter.patch("/edit", authMiddleware , async(req,res) => {
  try {
   const isValidRequest =  validateEditRequest(req);

   if(!isValidRequest){
    throw new Error("Invalid request")
   }

   let loggedInUser = req.user;

   Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

   await loggedInUser.save()

   loggedInUser = loggedInUser.toJSON()

   console.log(loggedInUser)
   res.send(loggedInUser)

  }catch(err) {
    res.status(400).send("Error : "+ err.message)
  }
})

profileRouter.patch("/password", authMiddleware, async (req, res) => {
  try {

    const newPassword = await bcrypt.hash(req.body.password, 10);

    const loggedInuser = req.user;

    loggedInuser.password = newPassword;

    await loggedInuser.save({runValidators : true});

    res.send("User password Updated")

  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

