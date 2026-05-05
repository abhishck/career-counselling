import { GoogleAIFileManager } from "@google/generative-ai/server";
import { model } from "../config/gemini.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Initialize File Manager
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  let tempFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // 1. Create a temporary file path
    tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${req.file.originalname}`);
    await fs.writeFile(tempFilePath, req.file.buffer);

    // 2. Upload to Gemini
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: "application/pdf",
      displayName: req.file.originalname,
    });

    // 3. Wait for the file to be processed
    console.log(`Uploaded file: ${uploadResult.file.uri}`);

    // 4. Generate content
    const prompt = `
      You are an expert ATS analyzer. Analyze the provided resume file.
      Return the result as a strict JSON object with keys: "score", "keywords_missing", "suggestions".
    `;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      { text: prompt },
    ]);

    const jsonText = result.response.text();
    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();

    // 5. Clean up from Gemini and Local Disk
    await fileManager.deleteFile(uploadResult.file.name);
    await fs.unlink(tempFilePath);

    return res.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    
    // Cleanup if something crashed
    if (tempFilePath) await fs.unlink(tempFilePath).catch(() => {});
    
    return res.status(500).json({ 
      message: "AI analysis failed.", 
      details: error.message 
    });
  }
};