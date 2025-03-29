import express from "express"
import db from "./config/mongoose_connection.js";
import apiRoute from "./routes/apiRoutes.js"
import dotenv from 'dotenv'
import userRoute from "./routes/userRoutes.js"
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use("/", userRoute)

app.use("/api", apiRoute)

app.post("/itenary", (req,res) => {
    const itineraryData = req.body;
    
    // Log the incoming data
    console.log("Received itinerary data:", itineraryData);
    
    // Send a response back to the client
    res.json({
      message: "Itinerary successfully created!",
      data: itineraryData
    });
})


app.listen(3000,() => {
    console.log("listening port 3000")
})