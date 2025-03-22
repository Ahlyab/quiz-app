const express = require("express");
const { submitQuiz, getQuizResult } = require("../controllers/quiz.controller");
const router = express.Router();

router.post("/", submitQuiz);
router.get("/:id", getQuizResult);

module.exports = router;
