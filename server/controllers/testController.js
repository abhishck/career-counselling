import { questions } from "../data/questions.js";
import { model } from "../config/gemini.js";
import TestResult from "../models/TestResult.js";

// 📥 Get Questions
export const getQuestions = (req, res) => {
  res.json(questions);
};

// 📤 Submit Test (WITH DB SAVE)

export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;

    // ❗ FIXED: Validation now checks for an Object, not an Array
    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return res.status(400).json({ message: "Valid answers are required" });
    }

    // 🧮 Score logic (counting keys in the object)
    const score = Object.keys(answers).length * 10;

    // 🧠 FIXED: Convert Object (id: value) → readable text
    // Example: { work_style: 'Analytical' } becomes "work_style: Analytical"
    const userChoices = Object.entries(answers)
      .map(([questionId, selectedOption]) => `${questionId}: ${selectedOption}`)
      .join(", ");

    // 🤖 Gemini Prompt
    const prompt = `
You are an AI career counsellor.

Based on the user's answers:
${userChoices}

Provide:
1. Career suggestions
2. Skills to learn
3. Next steps

Keep it short, structured, and practical.
`;

    const result = await model.generateContent(prompt);
    let aiText = result.response.text();

    // 🧹 Clean response
    aiText = aiText.trim();

    // 💾 SAVE RESULT IN DATABASE
    const savedResult = await TestResult.create({
      user: req.user._id,
      answers: answers, // Storing the object directly is fine
      score,
      recommendation: aiText,
    });

    // ✅ Response
    res.json({
      message: "Test submitted successfully",
      result: savedResult,
    });
  } catch (error) {
    console.error("Test Error:", error);
    res.status(500).json({ message: "Test evaluation failed" });
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