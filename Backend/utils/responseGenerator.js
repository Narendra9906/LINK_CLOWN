import express from 'express'
import {GoogleGenerativeAI}  from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GOO_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
;
const responseGenerator = async(req,res) => {
    const val = req.body
    const result = await model.generateContent("{" + val['data'] + "} Keep the ans very specific and to the point And DO NOT USE * ");
    res.send(JSON.stringify(result.response.candidates[0].content.parts[0].text));
}
export default responseGenerator