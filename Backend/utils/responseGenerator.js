import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOO_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const responseGenerator1 = async (req, res) => {
  try {
    const val = req.body;
    const result = await model.generateContent(val['data'] + " Keep the answer very specific and to the point. DO NOT USE *");
    const responseData = result.response;
    const responseText = responseData.candidates[0].content.parts[0].text; // Corrected response parsing
    res.send(responseText);
  } catch (error) {
    console.error("Error in responseGenerator1:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const responseGenerator2 = async (req, res) => {
  try {
    const val = req.body;
    console.log(val)
    const prompt = `
        ${JSON.stringify(val, null, 2)}
      1) Keep the answer very specific and to the point.
      2) REMOVE *(stars) IN YOUR TEXT GENERATION.
      3) Based on the data given, provide:
        - [LOCATION TO VISIT IN PLACE HE IS GOING (toWhere)].
        - Based on his budget (budgetConstraint) and trip type (solo, friends, family), provide the best accommodation details based on his/her (accommodationType)[GIVE NAME OF HOTELS].
    `;
    console.log(prompt);
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text(); // Corrected response parsing
    console.log(responseText)
    res.send(responseText);
  } catch (error) {
    console.error("Error in responseGenerator2:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { responseGenerator1, responseGenerator2 };
