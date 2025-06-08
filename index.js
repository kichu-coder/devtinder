import express from "express"
import { authMiddleware } from "./middlewares/auth.js";

const app = express()

app.use(express.json()); // Built-in middleware in Express to parse JSON bodies


app.post("/admin/getAllData" , authMiddleware , (req, res) => {
    try {
        throw new Error("new Error to handle")
        res.send("All data sent")
    } catch(err) {
        // next(err)
        res.status(500).send("Somethign went wrong contact support team")
    }
})

app.get("/admin/deleteUser",authMiddleware,(req,res) =>{
        res.send("Deleted a User")
})

app.use("/", (err , req, res, next) => {
    if(err) {
        console.log("Error caught: " , err.message)
        res.status(500).send("Something went wrong")
    }
    next()
})

app.listen(3000 , () => {
    console.log("server is listening in port 3000")
})