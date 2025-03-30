import express from "express"
import db from "./config/mongoose_connection.js";
import apiRoute from "./routes/apiRoutes.js"
import dotenv from 'dotenv'
import userRoute from "./routes/userRoutes.js"
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/", userRoute)

app.use("/api", apiRoute)


app.listen(3000,() => {
    console.log("listening port 3000")
})