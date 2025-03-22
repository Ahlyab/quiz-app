# QuizShare

QuizShare is a modern web application that allows users to create, share, and instantly view results for quizzes - all without requiring registration or login.

## ✨ Features

- **Create Custom Quizzes**: Build quizzes with multiple question types
- **No Account Required**: Create and share quizzes without registration
- **Instant Results**: View quiz results immediately after completion
- **Shareable Links**: Easily share quizzes and results with unique URLs
- **Responsive Design**: Works seamlessly across all devices
- **Persistent Storage**: All quizzes are stored securely in MongoDB

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Styling**: Tailwindcss

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/Ahlyab/quiz-app.git
cd quiz-app
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables

```bash
# In the server directory, create a .env file
touch .env
```

Add the following variables to your .env file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizshare
CLIENT_URL=http://localhost:3000
```

4. Start the development servers

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## 📝 Usage

### Creating a Quiz

1. Navigate to the home page
2. Click "Create Quiz"
3. Add questions, options, and correct answers
4. Click "Save Quiz" to generate a shareable link

### Taking a Quiz

1. Open the quiz link
2. Answer the questions
3. Submit to see instant results

### Sharing Results

1. After completing a quiz, click "Share Results"
2. Copy the generated link and share with others

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Ahlyab/quiz-app/issues).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
