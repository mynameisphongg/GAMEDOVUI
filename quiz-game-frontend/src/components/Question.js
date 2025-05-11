import React from "react";


const Question = ({ question, options, correctAnswer, handleAnswer, selectedAnswer, isCorrect }) => {
  return (
    <div className="question-container">
      <h3>{question}</h3>
      <div className="options-container">
        {options.map((option, index) => {
          let className = "option";

          if (selectedAnswer) {
            if (option === correctAnswer && isCorrect) {
              className += " correct"; // Đúng thì tô màu xanh
            } else if (option === selectedAnswer && !isCorrect) {
              className += " wrong"; // Sai thì tô màu đỏ
            }
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(option)}
              disabled={isCorrect} // Khi đúng rồi thì khóa
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
