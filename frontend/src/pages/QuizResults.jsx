import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const QuizResults = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultResponse = await axios.get(`/api/quiz-results/${resultId}`);
        setResult(resultResponse.data);

        const quizResponse = await axios.get(
          `/api/quizzes/${resultResponse.data.quizId}`
        );
        setQuiz(quizResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching result:", error);
        setError("Failed to load quiz results. The link may be invalid.");
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 inline-block">
          <p>{error}</p>
        </div>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!result || !quiz) {
    return null;
  }

  const shareResults = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Result link copied to clipboard!");
  };

  const calculatePercentage = () => {
    return Math.round((result.score / quiz.questions.length) * 100);
  };

  const getResultMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return "Excellent job!";
    if (percentage >= 70) return "Great work!";
    if (percentage >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {quiz.title} - Results
          </h1>
          <p className="text-gray-600 mb-6">{quiz.description}</p>

          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative h-32 w-32 mb-4">
              <div className="h-full w-full rounded-full border-8 border-indigo-100"></div>
              <div
                className="absolute top-0 left-0 h-full w-full rounded-full border-8"
                style={{
                  borderColor: "transparent",
                  borderTopColor:
                    calculatePercentage() >= 70
                      ? "#4F46E5"
                      : calculatePercentage() >= 40
                      ? "#F59E0B"
                      : "#EF4444",
                  borderRightColor:
                    calculatePercentage() >= 50 ? "#4F46E5" : "#EF4444",
                  transform: "rotate(45deg)",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {calculatePercentage()}%
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800 mb-1">
                {result.score} out of {quiz.questions.length} correct
              </p>
              <p className="text-lg text-indigo-600 font-medium">
                {getResultMessage()}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition duration-300"
            >
              {showAnswers ? "Hide Answers" : "Show Answers"}
            </button>
            <button
              onClick={shareResults}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition duration-300"
            >
              Share Results
            </button>
          </div>
        </div>

        {showAnswers && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question Breakdown
            </h2>

            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const selectedOption = result.answers[index];
                const isCorrect = selectedOption === question.correctOption;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-md ${
                      isCorrect
                        ? "bg-green-50 border border-green-100"
                        : "bg-red-50 border border-red-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <span className="text-white text-xs">
                          {isCorrect ? "✓" : "✗"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">
                          {index + 1}. {question.text}
                        </h3>

                        <div className="ml-1 space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`px-3 py-2 rounded text-sm ${
                                optIndex === question.correctOption
                                  ? "bg-green-100 text-green-800"
                                  : optIndex === selectedOption
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-50 text-gray-600"
                              }`}
                            >
                              {option}
                              {optIndex === question.correctOption &&
                                " (Correct)"}
                              {optIndex === selectedOption &&
                                optIndex !== question.correctOption &&
                                " (Your Answer)"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Create Your Own Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
