import { GoogleGenerativeAI } from "@google/generative-ai";
import TestResult from "../models/TestResult.js";
import { questions } from "../data/questions.js";

// Initialize AI configuration once at the top level
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// 📥 Get Questions
export const getQuestions = (req, res) => {
  res.json(questions);
};

// 📤 Submit Test (WITH AI ANALYSIS & DB SAVE)
export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    
    const userId = req.user._id;

    // 1. Calculate a simple score (example logic)
    const score = Object.keys(answers).length * 10; 

    // 2. Prepare the AI Prompt
    const prompt = `
      The user took a career test. Here are their answers: ${JSON.stringify(answers)}.
      Their calculated score is ${score}.
      Based on these inputs, suggest 3 specific career paths that fit their profile.
      Return the response as a valid JSON object with this exact structure:
      {
        "score": ${score},
        "suggestions": ["Career 1", "Career 2", "Career 3"]
      }
    `;

    // 3. Call AI using the pre-initialized model
    const result = await aiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean and parse the AI response
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(jsonString);

    // 4. Save to Database
    const newTest = await TestResult.create({
      user: userId,
      answers,
      score: aiData.score,
      recommendation: aiData.suggestions.join(", "),
    });

    // 5. Send back to your React Frontend
    res.status(200).json(aiData);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: "Failed to generate AI suggestions." });
  }
};

// 📊 Get Logged-in User Results
export const getUserResults = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error("Fetch Results Error:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};