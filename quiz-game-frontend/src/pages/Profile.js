import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  EmojiEvents,
  Timer,
  Category,
  TrendingUp,
  CheckCircle,
  Cancel,
  ArrowBack,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import API_ENDPOINTS from '../config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    name: name || '',
    totalScore: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    wrongAnswers: 0,
    averageTime: 0,
    categoryStats: {},
    recentGames: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchPlayerStats();
  }, [name]);

  const fetchPlayerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_ENDPOINTS.PLAYER_STATS(name));
      
      if (!response.data) {
        throw new Error('Không nhận được dữ liệu từ server');
      }

      if (response.data.message === 'No games played yet') {
        setPlayer(prev => ({ 
          ...prev,
          name: response.data.name || name || '',
          totalScore: 0,
          correctAnswers: 0,
          totalQuestions: 0,
          wrongAnswers: 0,
          averageTime: 0,
          categoryStats: {},
          recentGames: []
        }));
      } else {
        const safeData = {
          name: response.data.name || name || '',
          totalScore: Number(response.data.totalScore) || 0,
          correctAnswers: Number(response.data.correctAnswers) || 0,
          totalQuestions: Number(response.data.totalQuestions) || 0,
          wrongAnswers: Number(response.data.wrongAnswers) || 0,
          averageTime: Number(response.data.averageTime) || 0,
          categoryStats: response.data.categoryStats || {},
          recentGames: Array.isArray(response.data.recentGames) ? response.data.recentGames.map(game => ({
            ...game,
            points: Number(game.points) || 0,
            timeSpent: Number(game.timeSpent) || 0,
            correct: Number(game.correct) || 0,
            total: Number(game.total) || 1,
            date: game.playedAt || game.date || new Date(),
            category: game.category || 'general',
            difficulty: game.difficulty || 'medium'
          })) : []
        };
        setPlayer(safeData);
      }
    } catch (err) {
      console.error('Error fetching player stats:', err);
      setError('Failed to load player statistics');
    } finally {
      setLoading(false);
    }
  };

  // Hàm helper để format số an toàn
  const safeToFixed = (value, digits = 1) => {
    if (typeof value !== 'number' || isNaN(value)) return '0.0';
    return value.toFixed(digits);
  };

  // Hàm helper để tính phần trăm an toàn
  const safePercentage = (value, total) => {
    if (typeof value !== 'number' || typeof total !== 'number' || total === 0) return 0;
    return (value / total) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        {retryCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            Đang thử kết nối lại... (Lần {retryCount}/3)
          </Typography>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Quay Lại
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setRetryCount(0);
            fetchPlayerStats();
          }}
        >
          Thử Lại
        </Button>
      </Container>
    );
  }

  // Nếu người chơi chưa chơi game nào
  if (!player.totalQuestions) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Hồ Sơ của {player.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Người chơi này chưa tham gia trò chơi nào.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/game')}>
            Bắt Đầu Chơi
          </Button>
        </Box>
      </Container>
    );
  }

  // Prepare data for charts
  const scoreHistoryData = {
    labels: (player.recentGames || []).map((_, index) => `Ván ${index + 1}`),
    datasets: [
      {
        label: 'Điểm mỗi ván',
        data: (player.recentGames || []).map((game) => game?.points || 0),
        borderColor: 'rgb(33, 150, 243)',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(player.categoryStats || {}).map(
      (cat) => {
        const categoryMap = {
          'general': 'Kiến thức chung',
          'science': 'Khoa học',
          'history': 'Lịch sử',
          'sports': 'Thể thao',
          'entertainment': 'Giải trí'
        };
        return categoryMap[cat] || 'Không xác định';
      }
    ),
    datasets: [
      {
        label: 'Câu trả lời đúng',
        data: Object.values(player.categoryStats || {}).map((stat) => stat?.correct || 0),
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tổng số câu hỏi',
        data: Object.values(player.categoryStats || {}).map((stat) => stat?.played || 0),
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mr: 'auto' }}
          >
            Quay Lại
          </Button>
          <Typography variant="h4" component="h1">
            Hồ Sơ của {player.name}
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmojiEvents color="primary" />
                  <Typography variant="h6">Tổng Điểm</Typography>
                </Box>
                <Typography variant="h4">{player.totalScore || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle color="success" />
                  <Typography variant="h6">Độ Chính Xác</Typography>
                </Box>
                <Typography variant="h4">
                  {safeToFixed(safePercentage(player.correctAnswers, player.totalQuestions))}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {player.correctAnswers} đúng / {player.totalQuestions} tổng số
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Timer color="primary" />
                  <Typography variant="h6">Thời Gian TB</Typography>
                </Box>
                <Typography variant="h4">{safeToFixed(player.averageTime)}s</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Category color="primary" />
                  <Typography variant="h6">Chủ Đề Đã Chơi</Typography>
                </Box>
                <Typography variant="h4">
                  {Object.values(player.categoryStats || {}).filter(stat => (stat?.played || 0) > 0).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Điểm Số Gần Đây
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={scoreHistoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Performance
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Games */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Games
            </Typography>
            {Array.isArray(player.recentGames) && player.recentGames.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Chủ đề</TableCell>
                      <TableCell>Điểm</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Độ chính xác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {player.recentGames.map((game, index) => {
                      const timeSpent = typeof game?.timeSpent === 'number' ? game.timeSpent : 0;
                      const correct = typeof game?.correct === 'number' ? game.correct : 0;
                      const total = typeof game?.total === 'number' ? game.total : 1;
                      const date = game?.date ? new Date(game.date) : new Date();
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {date.toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const categoryMap = {
                                'general': 'Kiến thức chung',
                                'science': 'Khoa học',
                                'history': 'Lịch sử',
                                'sports': 'Thể thao',
                                'entertainment': 'Giải trí'
                              };
                              return categoryMap[game?.category] || game?.category || 'N/A';
                            })()}
                          </TableCell>
                          <TableCell>{game?.points || 0}</TableCell>
                          <TableCell>{safeToFixed(timeSpent)}s</TableCell>
                          <TableCell>
                            {safeToFixed(safePercentage(correct, total))}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 2 }}>
                Chưa có ván chơi nào
              </Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Profile; 