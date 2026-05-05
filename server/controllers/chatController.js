import { model } from "../config/gemini.js";
import Chat from "../models/Chat.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let chat;

    // 🔎 Find existing chat or create new
    if (chatId) {
      chat = await Chat.findById(chatId);
    }

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        messages: [],
      });
    }

    // 🧠 Prepare history for Gemini
    const formattedHistory = chat.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // ➕ Add current message
    formattedHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    // 🤖 System prompt
    const systemPrompt = `
You are an AI Career Counsellor.

- Help users choose careers
- Suggest skills and roadmap
- Keep answers short and practical
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        ...formattedHistory,
      ],
      generationConfig: {
        temperature: 0.7,
      },
    });

    const reply = result.response.text().trim();

    // 💾 Save messages
    chat.messages.push({ role: "user", text: message });
    chat.messages.push({ role: "bot", text: reply });

    await chat.save();

    res.json({
      chatId: chat._id,
      reply,
    });
  } catch (error) {
    console.error("Chat Save Error:", error);
    res.status(500).json({ message: "Chatbot failed" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });

    res.json(chats);
  } catch (error) {
    console.error("Fetch Chat Error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};