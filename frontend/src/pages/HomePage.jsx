// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      try {
        const response = await axios.get("/api/quizzes/recent");
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setRecentQuizzes(response.data);
        } else {
          // If it's not an array, check if there's a data property that is an array
          if (response.data && Array.isArray(response.data.data)) {
            setRecentQuizzes(response.data.data);
          } else {
            console.error("Unexpected API response format:", response.data);
            setError("Failed to load quizzes: Unexpected data format");
            setRecentQuizzes([]); // Ensure recentQuizzes is always an array
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent quizzes:", error);
        setError("Failed to load quizzes. Please try again later.");
        setRecentQuizzes([]); // Ensure recentQuizzes is always an array
        setLoading(false);
      }
    };

    fetchRecentQuizzes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Quiz App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create and share quizzes without registration
        </p>
        <Link
          to="/create"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition duration-300"
        >
          Create a Quiz
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recently Created Quizzes
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading recent quizzes...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : recentQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {quiz.description
                      ? quiz.description.substring(0, 100) +
                        (quiz.description.length > 100 ? "..." : "")
                      : "No description available"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {quiz.questionCount || 0} questions
                    </span>
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition duration-300"
                    >
                      Take Quiz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No quizzes available yet. Be the first to create one!
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
