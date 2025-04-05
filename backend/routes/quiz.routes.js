const express = require("express");
const router = express.Router();
const {
  getRecentQuizzes,
  createQuiz,
  getQuizById,
} = require("../controllers/quiz.controller");

router.get("/recent", getRecentQuizzes);
router.post("/", createQuiz);
router.get("/:id", getQuizById);

module.exports = router;
