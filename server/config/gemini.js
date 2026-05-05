import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI KEY EXISTS:", !!API_KEY);

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is undefined at gemini.js load time");
}

// 1. Initialize the library
const genAI = new GoogleGenerativeAI(API_KEY);

// 2. Initialize the specific model
// Using 'gemini-3-flash' as it's the current stable high-speed model
export const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// Example usage (Optional):
// const result = await model.generateContent("Hello!");