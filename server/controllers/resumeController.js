import { model } from "../config/gemini.js";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const analyzeResume = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    filePath = req.file.path;

    // 📄 Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Could not extract enough text from resume",
      });
    }

    // 🤖 Gemini Prompt
    const prompt = `
You are an expert ATS system and career coach.

Analyze the resume and return ONLY valid JSON:

{
  "score": number,
  "keywords_missing": ["skill1", "skill2"],
  "suggestions": ["improvement1", "improvement2"]
}

Rules:
- No explanation
- No markdown
- Only JSON output

Resume:
${resumeText}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
      },
    });

    let text = result.response.text();

    // 🧹 Clean Gemini output
    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        error: "Invalid JSON from AI",
        raw: text,
      };
    }

    res.json(parsed);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    res.status(500).json({ message: "AI analysis failed" });
  } finally {
    // 🧹 Cleanup file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};