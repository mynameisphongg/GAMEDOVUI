import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Question from "../components/Question";
import correctSound from "../assets/correct.mp4";
import wrongSound from "../assets/wrong.mp4";
import bgMusic from "../assets/bg-music.mp3";
import "../styles/QuizPage.css";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [canAnswer, setCanAnswer] = useState(true);

  const playerName = location.state?.name || "Người chơi";

  useEffect(() => {
    axios
      .get("http://localhost:5000/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const music = new Audio(bgMusic);
    music.loop = true;
    music.volume = 0.3;
    music.play().catch((err) => console.log("Autoplay blocked", err));
    return () => music.pause();
  }, []);

  const handleAnswer = (answer) => {
    if (!questions.length || !canAnswer) return;
  
    const correctAnswer = questions[currentIndex]?.answer;
    const isAnswerCorrect = answer === correctAnswer;
  
    setSelectedAnswer(answer);
    setIsCorrect(isAnswerCorrect);
    setCanAnswer(false); // Ngăn chọn nhiều lần
  
    if (isAnswerCorrect) {
      new Audio(correctSound).play();
      setScore(prevScore => prevScore + 1);
  
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setCanAnswer(true);
  
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          navigate("/result", { state: { name: playerName, score } });
        }
      }, 2000); // Chỉ chuyển câu khi chọn đúng
    } else {
      new Audio(wrongSound).play();
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setCanAnswer(true); // Cho phép chọn lại
      }, 2000); // Giữ hiệu ứng sai trong 2 giây
    }
  };
  

  return (
    <div className="quiz-container">
      <h1>Người chơi: {playerName}</h1>
      <h2>Điểm: {score}</h2>
      <h2>Câu hỏi {currentIndex + 1}/{questions.length}</h2>

      {questions.length > 0 ? (
        <Question
          question={questions[currentIndex].question}
          options={questions[currentIndex].options}
          correctAnswer={questions[currentIndex].answer}
          handleAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
        />
      ) : (
        <p className="loading">Đang tải câu hỏi...</p>
      )}
    </div>
  );
};

export default QuizPage;
