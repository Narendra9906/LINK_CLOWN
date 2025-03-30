import express from "express";
import authController from "../controllers/authController.js"; 
import responseGenerator from "../utils/responseGenerator.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/itenary", (req,res) => {
    const itineraryData = req.body;

    // Log the incoming data
    console.log("Received itinerary data:", itineraryData);

    // Send a response back to the client
    res.json({
      message: "Itinerary successfully created!",
      data: itineraryData
    });
})

router.post("/chat", responseGenerator)

export default router;
