import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionId: Number,
        optionIndex: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    recommendation: {
      type: String,
    },
  },
  { timestamps: true }
);

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;