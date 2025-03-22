const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const quizRoutes = require("./routes/quiz.routes");
const quizResultsRoutes = require("./routes/quizResuts.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quiz-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
// Get recent quizzes

app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-results", quizResultsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
