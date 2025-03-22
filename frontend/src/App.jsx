import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResults from "./pages/QuizResults";
import Navbar from "./components/Navbar";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/quiz/:quizId" element={<TakeQuiz />} />
            <Route path="/results/:resultId" element={<QuizResults />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
