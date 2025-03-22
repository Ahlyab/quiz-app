import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    questions: [{ text: "", options: ["", "", "", ""], correctOption: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareableLink, setShareableLink] = useState("");

  const handleQuizDataChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].text = e.target.value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { text: "", options: ["", "", "", ""], correctOption: 0 },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions.splice(index, 1);
      setQuizData({
        ...quizData,
        questions: updatedQuestions,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/quizzes", quizData);
      const quizId = response.data._id;
      const link = `${window.location.origin}/quiz/${quizId}`;
      setShareableLink(link);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Create a New Quiz
      </h1>

      {!shareableLink ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="title"
            >
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={quizData.title}
              onChange={handleQuizDataChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a title for your quiz"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={quizData.description}
              onChange={handleQuizDataChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a description for your quiz"
              rows="3"
            ></textarea>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                Add Question
              </button>
            </div>

            {quizData.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-gray-50 p-4 rounded-md mb-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-700">
                    Question {questionIndex + 1}
                  </h3>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="radio"
                        name={`correctOption-${questionIndex}`}
                        checked={question.correctOption === optionIndex}
                        onChange={() =>
                          handleCorrectOptionChange(questionIndex, optionIndex)
                        }
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        required
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(questionIndex, optionIndex, e)
                        }
                        className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Quiz Created Successfully!
          </h2>
          <p className="text-gray-700 mb-6">
            Share this link with others to take your quiz:
          </p>

          <div className="flex items-center justify-center mb-8">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none"
            />
            <button
              onClick={copyShareableLink}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.open(shareableLink, "_blank")}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              View Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
