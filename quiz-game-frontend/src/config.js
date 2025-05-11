// API Configuration
const API_BASE_URL = 'https://gamedovuinp.up.railway.app';

export const API_ENDPOINTS = {
    QUESTIONS: `${API_BASE_URL}/api/questions`,
    PLAYERS: `${API_BASE_URL}/api/players`,
    LEADERBOARD: `${API_BASE_URL}/api/players/leaderboard`,
    SUBMIT_SCORE: `${API_BASE_URL}/api/players/score`,
    PLAYER_STATS: (name) => `${API_BASE_URL}/api/players/stats/${encodeURIComponent(name)}`,
    CHECK_PLAYER: (name, category) => `${API_BASE_URL}/api/players/check/${encodeURIComponent(name)}/${category}`,
    RANDOM_QUESTIONS: (category, difficulty, limit) => 
        `${API_BASE_URL}/api/questions/random?category=${category}&difficulty=${difficulty}&limit=${limit}`
};

export default API_ENDPOINTS; 