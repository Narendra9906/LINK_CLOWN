import express from "express"
import {GoogleGenerativeAI}  from "@google/generative-ai";
const router = express.Router();
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GOO_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.get("/jokes",async (req,res) => {
    const result = await model.generateContent("Create a small joke");
    const jokes = [
        {
            id:1,
            title: 'A first Joke',
            content: JSON.stringify(result.response.candidates[0].content.parts[0].text)
        }
    ]
    res.send(jokes);
})

router.get("/wether",async(req,res) => {
    const weatherResponse = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=Mathura`);
    const weatherData = await weatherResponse.json();
    res.send(`Temperature in Celsius: ${weatherData.current.temp_c}`)
})

router.get("/news", async(req,res) => {
    const NewsResponse = await fetch(`https://newsapi.org/v2/top-headlines?q=elonmusk&apiKey=${process.env.NEWS_API}`)
    res.send(NewsResponse)
})

router.get("/whatsapp",async(req,res) => {
    await sendMessage('+919458016708', 'Hello')
})

export default router;