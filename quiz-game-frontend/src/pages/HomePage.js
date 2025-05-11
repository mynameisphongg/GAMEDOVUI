import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      navigate("/quiz", { state: { name } });
    } else {
      alert("Vui lòng nhập tên của bạn!");
    }
  };

  return (
    <div className="home-container">
      <h1>Chào mừng đến với Quiz Game!</h1>
      <input
        type="text"
        placeholder="Nhập tên của bạn"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleStart}>Bắt đầu chơi</button>
    </div>
  );
};

export default HomePage;
