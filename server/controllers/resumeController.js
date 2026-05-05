import { model } from "../config/gemini.js";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// 🧠 Safe JSON parser
const safeJSONParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return {
      error: "Invalid JSON from AI",
      raw: text,
    };
  }
};

export const analyzeResume = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    filePath = req.file.path;

    // 📄 Extract PDF text
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Could not extract enough text from resume",
      });
    }

    // 🤖 Strong ATS Prompt
    const prompt = `
You are an expert ATS resume analyzer and career coach.

Return ONLY valid JSON (no markdown, no explanation):

{
  "score": number (0-100),
  "keywords_missing": string[],
  "suggestions": string[]
}

Rules:
- Output must be valid JSON only
- No extra text, no markdown
- Be strict and accurate

Resume:
${resumeText}
`;

    // 🤖 Gemini chat (correct approach)
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.4,
      },
    });

    const result = await chat.sendMessage(prompt);
    let text = result.response.text();

    // 🧹 Clean AI response
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 📦 Parse safely
    const parsed = safeJSONParse(text);

    return res.json(parsed);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return res.status(500).json({ message: "AI analysis failed" });
  } finally {
    // 🧹 Cleanup uploaded file safely
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("File cleanup error:", err);
    }
  }
};