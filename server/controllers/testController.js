import TestResult from "../models/TestResult.js";
import { questions } from "../data/questions.js";

// 1. Helper function for logic-based suggestions
const getCareerSuggestions = (score, answers) => {
  // 1. Specific Logic: If they have a high score and like Coding
  if (answers.interest === 'coding' && score > 60) {
    return ["Senior Full Stack Developer", "Software Architect", "Lead DevOps Engineer"];
  }

  // 2. Specific Logic: If they prefer Design/Creativity
  if (answers.interest === 'design') {
    return ["UI/UX Designer", "Product Designer", "Graphic Lead"];
  }

  // 3. Specific Logic: If they like Management/People
  if (answers.management_style === 'people-oriented' || score > 70) {
    return ["Project Manager", "Team Lead", "Operations Manager"];
  }

  // 4. Default Fallback Logic (Score-based)
  if (score <= 30) {
    return ["Customer Support Representative", "Administrative Assistant"];
  } else {
    return ["Junior Data Analyst", "Technical Support Specialist"];
  }
};
// 📥 Get Questions
export const getQuestions = (req, res) => {
  res.json(questions);
};

// 📤 Submit Test (Hardcoded logic, Database save)
// 📤 Submit Test
export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body; 
    const userId = req.user._id;

    // 1. Define your "Answer Key" (Points map)
    // Customize these values based on your test question options
    const pointsMap = {
      'coding': 20,
      'design': 15,
      'marketing': 15,
      'management': 10,
      'writing': 10,
      'people-oriented': 10,
      'task-oriented': 5,
      // Add all other possible answer values here...
    };

    // 2. Calculate dynamic score
    // This sums up points based on the actual values inside the 'answers' object
    const score = Object.values(answers).reduce((total, val) => {
      return total + (pointsMap[val] || 5); // Default to 5 points if answer is not in map
    }, 0);

    // 3. Get suggestions based on the new dynamic score and user answers
    const suggestions = getCareerSuggestions(score, answers);

    // 4. Save to Database
    const newTest = await TestResult.create({
      user: userId,
      answers,
      score: score, // This is now dynamic!
      recommendation: suggestions.join(", "),
    });

    res.status(200).json({
      score: score,
      suggestions: suggestions
    });

  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: "Failed to process test results." });
  }
};

// 📊 Get Logged-in User Results
export const getUserResults = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error("Fetch Results Error:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};