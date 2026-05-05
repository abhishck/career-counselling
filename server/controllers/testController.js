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

    // ❗ Validation
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Valid answers are required" });
    }

    // 🧮 Score logic (basic for now)
    const score = answers.length * 10;

    // 🧠 Convert answers → readable text
    const userChoices = answers
      .map((ans) => {
        const q = questions.find((q) => q.id === ans.questionId);
        return q ? q.options[ans.optionIndex] : "";
      })
      .filter(Boolean)
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

    // 🧹 Clean response (optional)
    aiText = aiText.trim();

    // 💾 SAVE RESULT IN DATABASE
    const savedResult = await TestResult.create({
      user: req.user._id,
      answers,
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