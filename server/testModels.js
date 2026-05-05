import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const test = async () => {
  try {
    const models = await genAI.listModels();
    console.log(models);
  } catch (err) {
    console.error("Error:", err);
  }
};

test();