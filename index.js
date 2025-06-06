import express from "express"

const app = express()

app.use("/user",(req,res) => {
    console.log(req.query, "params : ", req.params)
    res.send("Hello! welcome to dev tinder")
})


app.use("/test/:userid/:position/:power",(req,res) => {
    console.log(req.query, "params : ", req.params)
    res.send("Hello! welcome to dev tinder")
})

app.listen(3000 , () => {
    console.log("server is listening in port 3000")
})