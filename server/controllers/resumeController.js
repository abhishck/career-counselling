import { model } from "../config/gemini.js";
import fs from "fs";
import pdfParse from "pdf-parse";

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
  "score": number (0-100),
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 🧹 Clean response (Gemini sometimes adds ```json)
    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      parsed = {
        error: "AI returned invalid JSON",
        raw: text,
      };
    }

    res.json(parsed);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    res.status(500).json({ message: "AI analysis failed" });
  } finally {
    // 🧹 Delete uploaded file (important)
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};