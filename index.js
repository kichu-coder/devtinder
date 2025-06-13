import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { connectDb } from "./config/database.js";
import { User } from "./models/user.js";
import bcrypt from "bcrypt";
import { validateUserData } from "./helpers/utils.js";
import validator from "validator";

const app = express();

app.use(express.json()); // Built-in middleware in Express to parse JSON bodies

app.get("/dummy",(req,res,next) => {
  console.log("frist function")
  // next()
},(req,res) => {
  console.log("second function")
  res.send("Inside second function")
})

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

    const isValidUser = await bcrypt.compare(password, user.password);

      if(!isValidUser) {
        res.send("Login failed!!!")
      } else {
        res.send("Login Successfull!!!");
      }
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail }).exec();

    if (users.length === 0) {
      res.status(404).send("User Not Found");
    }

    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(400).send("Soemthing went wrong" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const users = await User.findByIdAndDelete(userId);

    res.send(`User Deleted Successfully : ${users}`);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.patch("/user", async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
      runValidators: true,
    });

    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
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
