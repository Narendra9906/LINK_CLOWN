import express from "express";
import authController from "../controllers/authController.js"; 
import {responseGenerator1, responseGenerator2} from "../utils/responseGenerator.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/itenary", responseGenerator2)

router.post("/chat", responseGenerator1)

export default router;
