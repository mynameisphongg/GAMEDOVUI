import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, score } = location.state || {}; // Lấy dữ liệu từ QuizPage

  // Nếu không có dữ liệu, hiển thị thông báo
  if (!name || score === undefined) {
    return (
      <div>
        <h2>Không có dữ liệu kết quả!</h2>
        <button onClick={() => navigate("/")}>Quay lại</button>
      </div>
    );
  }

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/players/submit", { name, score })
      .then(() => {
        alert("Kết quả đã được lưu!");
        navigate("/leaderboard"); // Chuyển đến bảng xếp hạng sau khi gửi
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Kết Quả</h2>
      <h3>Người chơi: {name}</h3>
      <h3>Điểm số: {score}</h3>
      <button onClick={handleSubmit}>Lưu Kết Quả</button>
      <button onClick={() => navigate("/")}>Chơi lại</button>
    </div>
  );
};

export default ResultPage;
