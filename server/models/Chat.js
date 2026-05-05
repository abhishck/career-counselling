import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String, // "user" or "bot"
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;