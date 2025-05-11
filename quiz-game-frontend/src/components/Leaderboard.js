import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/players/leaderboard")
      .then(res => setPlayers(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleStartGame = () => {
    if (name.trim() !== "") {
      localStorage.setItem("playerName", name);
      navigate("/quiz");
    }
  };

  return (
    <div className="leaderboard-container">
      {showInput ? (
        <div className="name-input-container">
          <h2>Nhập tên của bạn</h2>
          <input
            type="text"
            placeholder="Tên người chơi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleStartGame}>Bắt đầu</button>
        </div>
      ) : (
        <div className="leaderboard">
          <h2>Bảng Xếp Hạng</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.name} - {player.score} điểm</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;