import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);
        setSelectedOptions(
          new Array(response.data.questions.length).fill(null)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError(
          "Failed to load quiz. It may have been deleted or the link is invalid."
        );
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (optionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post("/api/quiz-results", {
        quizId: quiz._id,
        answers: selectedOptions,
      });
      navigate(`/results/${response.data._id}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border text-indigo-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 inline-block">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>

        <div className="bg-indigo-50 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>

        {!quizCompleted ? (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    onClick={() => handleOptionSelect(optionIndex)}
                    className={`p-3 rounded-md border cursor-pointer transition duration-300 ${
                      selectedOptions[currentQuestionIndex] === optionIndex
                        ? "bg-indigo-100 border-indigo-500"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-5 w-5 rounded-full border flex-shrink-0 mr-3 ${
                          selectedOptions[currentQuestionIndex] === optionIndex
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedOptions[currentQuestionIndex] ===
                          optionIndex && (
                          <span className="flex items-center justify-center h-full text-white text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              <button
                onClick={
                  isLastQuestion
                    ? () => setQuizCompleted(true)
                    : goToNextQuestion
                }
                disabled={selectedOptions[currentQuestionIndex] === null}
                className={`px-6 py-2 rounded-md ${
                  selectedOptions[currentQuestionIndex] === null
                    ? "bg-indigo-300 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLastQuestion ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to Submit
            </h2>
            <p className="text-gray-600 mb-6">
              You've answered all {quiz.questions.length} questions. Ready to
              see your results?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setQuizCompleted(false)}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
