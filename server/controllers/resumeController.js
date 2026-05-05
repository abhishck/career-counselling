import { model } from "../config/gemini.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // 📄 Extract text directly from the buffer (no disk access needed!)
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: "Could not extract enough text from resume." });
    }

    // 🤖 Gemini Prompt
    const prompt = `
      You are an ATS analyzer. Analyze the following resume text.
      Return the result as a strict JSON object with keys: "score", "keywords_missing", "suggestions".
      
      Resume Text:
      ${resumeText}
    `;

    const chat = model.startChat({
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    return res.json(JSON.parse(text));

  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return res.status(500).json({ message: "AI analysis failed." });
  }
  // No finally block needed because we never created a file!
};