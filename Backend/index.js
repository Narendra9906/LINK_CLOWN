import express from "express"
import db from "./config/mongoose_connection.js";
import apiRoute from "./routes/apiRoutes.js"
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.get("/",(req,res) => {
    res.send("WELCOME TO MY SERVER")
})

app.use("/api", apiRoute)

app.listen(3000,() => {
    console.log("listening port 3000")
})