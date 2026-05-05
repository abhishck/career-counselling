import { model } from "../config/gemini.js";
import Chat from "../models/Chat.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // 🔎 Find or create chat
    let chat = chatId ? await Chat.findById(chatId) : null;

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        messages: [],
      });
    }

    // 🧠 Convert DB history → Gemini format
    const history = chat.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // 🤖 System instruction (IMPORTANT: keep it as first context)
    const systemInstruction = `
You are an AI Career Counsellor.

Rules:
- Help users choose careers
- Suggest skills and roadmap
- Keep answers short and practical
- Be clear and structured
`;

    // 🚀 Start chat session (correct way)
    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        ...history,
      ],
      generationConfig: {
        temperature: 0.7,
      },
    });

    // 💬 Send user message
    const result = await chatSession.sendMessage(message);
    const reply = result.response.text().trim();

    // 💾 Save conversation
    chat.messages.push({ role: "user", text: message });
    chat.messages.push({ role: "bot", text: reply });

    await chat.save();

    return res.json({
      chatId: chat._id,
      reply,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ message: "Chatbot failed" });
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