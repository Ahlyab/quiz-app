const { Quiz } = require("../models/quiz.model");
const { Result } = require("../models/result.model");

const getRecentQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title description questions createdAt");

    // Add question count to each quiz
    const quizzesWithCount = quizzes.map((quiz) => {
      return {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        questionCount: quiz.questions.length,
        createdAt: quiz.createdAt,
      };
    });

    res.json(quizzesWithCount);
  } catch (error) {
    console.error("Error fetching recent quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      description,
      questions,
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctOption === answers[index]) {
        score++;
      }
    });

    const newResult = new Result({
      quizId,
      answers,
      score,
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuizResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRecentQuizzes,
  createQuiz,
  getQuizById,
  submitQuiz,
  getQuizResult,
};
