import express from "express"

const app = express()

app.use("/test",(req,res) => {
    res.send("Hello! welcome to dev tinder")
})

app.listen(3000 , () => {
    console.log("server is listening in port 3000")
})