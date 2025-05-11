import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  useTheme,
  Tooltip,
  IconButton,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  EmojiEvents,
  Category,
  Speed,
  HelpOutline,
  RemoveCircleOutline,
  AccessTime,
  BarChart,
} from '@mui/icons-material';
import useSound from 'use-sound';
import axios from 'axios';
import API_ENDPOINTS from '../config';

// Import sound effects
import bgMusic from '../assets/sounds/bg-music.mp3';
import correctSound from '../assets/sounds/correct.mp4';
import wrongSound from '../assets/sounds/wrong.mp4';

const categories = [
  { value: 'general', label: 'Kiến thức chung' },
  { value: 'science', label: 'Khoa học' },
  { value: 'history', label: 'Lịch sử' },
  { value: 'sports', label: 'Thể thao' },
  { value: 'entertainment', label: 'Giải trí' },
];

const difficulties = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

const Game = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({
    fiftyFifty: false,
    timeHint: false,
    audienceHint: false
  });
  const [availableOptions, setAvailableOptions] = useState([]);
  const [audienceData, setAudienceData] = useState(null);

  // Move useSound hooks to component level
  const [playCorrect] = useSound(correctSound);
  const [playWrong] = useSound(wrongSound);
  const [playBackground, { stop: stopBackground }] = useSound(bgMusic, { loop: true, volume: 0.5 });

  // Initialize sounds state
  const [sounds, setSounds] = useState({
    correct: null,
    wrong: null,
    background: null
  });

  // Initialize sounds after user interaction
  const initializeSounds = useCallback(() => {
    setSounds({
      correct: playCorrect,
      wrong: playWrong,
      background: playBackground
    });
  }, [playCorrect, playWrong, playBackground]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft]);

  // Start background music when game starts
  useEffect(() => {
    if (gameStarted && sounds.background) {
      sounds.background();
    }
    return () => {
      if (sounds.background) {
        stopBackground();
      }
    };
  }, [gameStarted, sounds.background, stopBackground]);

  const handleTimeUp = useCallback(() => {
    if (sounds.wrong) {
      sounds.wrong();
    }
    setGameOver(true);
    setShowNameDialog(true);
  }, [sounds.wrong]);

  const loadQuestions = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading questions for:', { category, difficulty, retryCount });
      
      const response = await axios.get(API_ENDPOINTS.RANDOM_QUESTIONS(category, difficulty, 10), {
        timeout: 15000, // Tăng timeout lên 15 giây
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Chấp nhận status từ 200-499
        }
      });

      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        console.log('Questions loaded successfully:', response.data.length);
        if (response.data.length === 0) {
          setError('Không có câu hỏi nào cho chủ đề và độ khó đã chọn.');
          return false;
        }
        setQuestions(response.data);
        setCurrentQuestion(0);
        return true;
      } else {
        console.error('Invalid response:', response);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      if (retryCount < 3) { // Thử lại tối đa 3 lần
        console.log(`Retrying... (${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Đợi 2 giây trước khi thử lại
        return loadQuestions(retryCount + 1);
      }
      
      if (err.response) {
        setError(`Lỗi server: ${err.response.status} - ${err.response.data?.message || 'Không thể tải câu hỏi'}`);
      } else if (err.request) {
        setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } else {
        setError('Có lỗi xảy ra khi tải câu hỏi. Vui lòng thử lại.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await loadQuestions();
      if (success) {
        setGameStarted(true);
        setScore(0);
        setTimeLeft(30);
        setHintsUsed({
          fiftyFifty: false,
          timeHint: false,
          audienceHint: false
        });
        setAvailableOptions([]);
        setAudienceData(null);
        initializeSounds();
      } else {
        setGameStarted(false);
      }
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Không thể bắt đầu game. Vui lòng thử lại.');
      setGameStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].answer;

    if (isCorrect && sounds.correct) {
      sounds.correct();
      const timeBonus = timeLeft / questions[currentQuestion].timeLimit;
      const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2,
      }[questions[currentQuestion].difficulty];
      
      const points = Math.round(questions[currentQuestion].points * difficultyMultiplier * (1 + timeBonus));
      setScore(prev => prev + points);
    } else if (!isCorrect && sounds.wrong) {
      sounds.wrong();
    }

    // Reset các state liên quan đến gợi ý khi chuyển câu hỏi
    setAvailableOptions([]);
    setAudienceData(null);

    // Sử dụng setTimeout để đảm bảo animation và âm thanh được phát
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(questions[currentQuestion + 1].timeLimit);
      } else {
        if (sounds.background) {
          stopBackground();
        }
        setGameOver(true);
        setShowNameDialog(true);
      }
    }, 1500);
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(playerName.trim())) {
      setError('Tên người chơi chỉ được chứa chữ cái, số và khoảng trắng');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const checkResponse = await axios.get(API_ENDPOINTS.CHECK_PLAYER(playerName.trim(), category));
      
      if (checkResponse.data.exists) {
        setError('Tên này đã được sử dụng trong chủ đề này. Vui lòng chọn tên khác hoặc chọn chủ đề khác.');
        return;
      }

      const gameData = {
        name: playerName.trim(),
        category: category,
        score: score,
        answers: questions.map((q, index) => ({
          questionId: q._id,
          answer: selectedAnswer,
          time: q.timeLimit - timeLeft,
          isCorrect: selectedAnswer === q.answer
        }))
      };

      const response = await axios.post(API_ENDPOINTS.SUBMIT_SCORE, gameData);

      if (response.data) {
        setSubmitDialogOpen(false);
        navigate(`/profile/${encodeURIComponent(playerName.trim())}`);
      }
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm tạo dữ liệu giả cho gợi ý khán giả
  const generateAudienceData = (correctAnswer) => {
    const total = 100;
    const correct = Math.floor(Math.random() * 30) + 40; // 40-70% chọn đúng
    const remaining = total - correct;
    const wrongOptions = questions[currentQuestion].options.filter(opt => opt !== correctAnswer);
    const wrongPercentages = wrongOptions.map(() => Math.floor(Math.random() * (remaining / wrongOptions.length)));
    const lastWrong = remaining - wrongPercentages.reduce((a, b) => a + b, 0);
    wrongPercentages[wrongPercentages.length - 1] += lastWrong;

    const data = {};
    questions[currentQuestion].options.forEach((opt, index) => {
      data[opt] = opt === correctAnswer ? correct : wrongPercentages[index];
    });
    return data;
  };

  // Hàm xử lý gợi ý 50:50
  const handleFiftyFifty = () => {
    if (hintsUsed.fiftyFifty || score < 10) return;
    
    const wrongOptions = questions[currentQuestion].options.filter(opt => opt !== questions[currentQuestion].answer);
    const optionsToRemove = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
    const remainingOptions = questions[currentQuestion].options.filter(opt => !optionsToRemove.includes(opt));
    
    // Cập nhật state trong một lần để tránh re-render nhiều lần
    setScore(prev => prev - 10);
    setHintsUsed(prev => ({ ...prev, fiftyFifty: true }));
    setAvailableOptions(remainingOptions);
  };

  // Hàm xử lý gợi ý thời gian
  const handleTimeHint = () => {
    if (hintsUsed.timeHint || score < 10) return;
    
    // Cập nhật state trong một lần
    setScore(prev => prev - 10);
    setHintsUsed(prev => ({ ...prev, timeHint: true }));
    setTimeLeft(prev => Math.min(prev + 15, questions[currentQuestion].timeLimit));
  };

  // Hàm xử lý gợi ý khán giả
  const handleAudienceHint = () => {
    if (hintsUsed.audienceHint || score < 10) return;
    
    // Cập nhật state trong một lần
    setScore(prev => prev - 10);
    setHintsUsed(prev => ({ ...prev, audienceHint: true }));
    setAudienceData(generateAudienceData(questions[currentQuestion].answer));
  };

  if (!gameStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ p: 4 }}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Cài Đặt Game
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={category}
                      label="Chủ đề"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Độ khó</InputLabel>
                    <Select
                      value={difficulty}
                      label="Độ khó"
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      {difficulties.map((diff) => (
                        <MenuItem key={diff.value} value={diff.value}>
                          {diff.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={startGame}
                  disabled={loading}
                  startIcon={<EmojiEvents />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {loading ? 'Đang tải...' : 'Bắt đầu chơi'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          Không có câu hỏi nào cho chủ đề và độ khó đã chọn.
        </Alert>
        <Button
          variant="contained"
          onClick={() => setGameStarted(false)}
          sx={{ mt: 2 }}
        >
          Quay lại cài đặt
        </Button>
      </Container>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Game Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.secondary">
              Câu hỏi {currentQuestion + 1} / {questions.length}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer color="primary" />
              <Typography variant="h6" color={timeLeft <= 5 ? 'error' : 'primary'}>
                {timeLeft}s
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEvents color="primary" />
              <Typography variant="h6">Điểm: {score}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Tooltip title={hintsUsed.fiftyFifty ? "Đã sử dụng" : "Loại bỏ 2 đáp án sai (-10 điểm)"}>
            <span>
              <IconButton 
                onClick={handleFiftyFifty}
                disabled={hintsUsed.fiftyFifty || score < 10 || selectedAnswer !== null}
                color={hintsUsed.fiftyFifty ? "disabled" : "primary"}
              >
                <RemoveCircleOutline />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={hintsUsed.timeHint ? "Đã sử dụng" : "Thêm 15 giây (-10 điểm)"}>
            <span>
              <IconButton 
                onClick={handleTimeHint}
                disabled={hintsUsed.timeHint || score < 10 || selectedAnswer !== null}
                color={hintsUsed.timeHint ? "disabled" : "primary"}
              >
                <AccessTime />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={hintsUsed.audienceHint ? "Đã sử dụng" : "Xem tỷ lệ chọn của khán giả (-10 điểm)"}>
            <span>
              <IconButton 
                onClick={handleAudienceHint}
                disabled={hintsUsed.audienceHint || score < 10 || selectedAnswer !== null}
                color={hintsUsed.audienceHint ? "disabled" : "primary"}
              >
                <BarChart />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / question.timeLimit) * 100}
          color={timeLeft <= 5 ? 'error' : 'primary'}
          sx={{ mt: 2 }}
        />
      </Box>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {question.question}
              </Typography>
              
              {/* Audience Hint Display */}
              {audienceData && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tỷ lệ chọn của khán giả:
                  </Typography>
                  <Stack spacing={1}>
                    {question.options.map((option) => (
                      <Box key={option} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={audienceData[option]}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 45 }}>
                          {audienceData[option]}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              <Grid container spacing={2}>
                {(availableOptions.length > 0 ? availableOptions : question.options).map((option, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        fullWidth
                        variant={
                          selectedAnswer === null
                            ? 'outlined'
                            : selectedAnswer === option
                            ? option === question.answer
                              ? 'contained'
                              : 'contained'
                            : option === question.answer
                            ? 'contained'
                            : 'outlined'
                        }
                        color={
                          selectedAnswer === null
                            ? 'primary'
                            : selectedAnswer === option
                            ? option === question.answer
                              ? 'success'
                              : 'error'
                            : option === question.answer
                            ? 'success'
                            : 'primary'
                        }
                        onClick={() => handleAnswerSelect(option)}
                        disabled={selectedAnswer !== null}
                        sx={{
                          py: 2,
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          px: 2,
                          opacity: availableOptions.length > 0 && !availableOptions.includes(option) ? 0.5 : 1,
                        }}
                      >
                        {option}
                      </Button>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Game Over Dialog */}
      <Dialog open={showNameDialog} onClose={() => {}}>
        <DialogTitle>Kết thúc game!</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Điểm số của bạn: {score}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Tên của bạn"
            fullWidth
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGameStarted(false)}>Chơi lại</Button>
          <Button
            onClick={() => {
              setShowNameDialog(false);
              setSubmitDialogOpen(true);
            }}
            variant="contained"
            disabled={!playerName.trim()}
          >
            Lưu điểm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Score Dialog */}
      <Dialog 
        open={submitDialogOpen} 
        onClose={() => {
          setSubmitDialogOpen(false);
          setPlayerName('');
          setError('');
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <EmojiEvents color="primary" />
          Lưu Điểm Số
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chủ đề: {categories.find(cat => cat.value === category)?.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Điểm số của bạn: {score}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Tên người chơi"
            type="text"
            fullWidth
            variant="outlined"
            value={playerName}
            onChange={(e) => {
              const value = e.target.value;
              // Chỉ cho phép nhập chữ cái, số và khoảng trắng
              if (value === '' || /^[a-zA-Z0-9\s]*$/.test(value)) {
                setPlayerName(value);
                setError('');
              }
            }}
            error={!!error}
            helperText={error || "Lưu ý: Tên chỉ được chứa chữ cái, số và khoảng trắng"}
            inputProps={{
              maxLength: 20 // Giới hạn độ dài tên
            }}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setSubmitDialogOpen(false);
              setPlayerName('');
              setError('');
            }}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmitScore}
            variant="contained"
            disabled={submitting || !playerName.trim()}
            sx={{ borderRadius: 2 }}
          >
            {submitting ? 'Đang lưu...' : 'Lưu Điểm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Game; 