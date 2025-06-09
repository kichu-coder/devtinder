import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { connectDb } from "./config/database.js";
import { User } from "./models/user.js";

const app = express();

app.use(express.json()); // Built-in middleware in Express to parse JSON bodies

app.post("/signUp", async (req, res) => {
  try {
    const userObj = {
      firstName: "neelima",
      lastName: "garlpati",
      emailId: "neelu@kichu.com",
      password: "kichuneeluhusband",
      age: 26,
      gender: "Female",
    };

    // creating a new instance of a user model
    const user = new User(userObj);

    const result = await user.save();

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error Saving the User : " + err.message)
  }
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
