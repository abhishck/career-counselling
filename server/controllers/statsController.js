import Chat from "../models/Chat.js";
import TestResult from "../models/TestResult.js";

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run both queries in parallel for better performance
    const [testsTaken, chats] = await Promise.all([
      TestResult.countDocuments({ user: userId }),
      Chat.countDocuments({ user: userId })
    ]);

    res.json({
      testsTaken,
      chats,
      // You can add logic for other stats here
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};