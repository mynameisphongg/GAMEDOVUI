import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const categories = [
  { value: 'all', label: 'Tất cả chủ đề' },
  { value: 'general', label: 'Kiến thức chung' },
  { value: 'science', label: 'Khoa học' },
  { value: 'history', label: 'Lịch sử' },
  { value: 'sports', label: 'Thể thao' },
  { value: 'entertainment', label: 'Giải trí' },
];

const timeFrames = [
  { value: 'all', label: 'Tất cả thời gian' },
  { value: 'daily', label: 'Hôm nay' },
  { value: 'weekly', label: 'Tuần này' },
  { value: 'monthly', label: 'Tháng này' },
];

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [timeFrame, setTimeFrame] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, [category, timeFrame]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5001/players/leaderboard?category=${category}&timeFrame=${timeFrame}`
      );
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePlayerClick = (name) => {
    navigate(`/profile/${name}`);
  };

  // Prepare data for charts
  const categoryData = {
    labels: categories.slice(1).map((cat) => cat.label),
    datasets: [
      {
        label: 'Average Score',
        data: categories.slice(1).map((cat) => {
          const scores = leaderboard
            .map((player) => player.categoryStats?.[cat.value]?.score || 0)
            .filter(score => score > 0);
          return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        }),
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Accuracy',
        data: categories.slice(1).map((cat) => {
          const accuracies = leaderboard
            .map((player) => {
              const stats = player.categoryStats?.[cat.value] || { played: 0, correct: 0 };
              return stats.played > 0 ? (stats.correct / stats.played) * 100 : 0;
            })
            .filter(acc => acc > 0);
          return accuracies.length > 0 ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length : 0;
        }),
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
    ],
  };

  const accuracyData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [
          leaderboard.reduce((sum, player) => sum + (player.correctAnswers || 0), 0),
          leaderboard.reduce((sum, player) => sum + (player.wrongAnswers || 0), 0),
        ],
        backgroundColor: ['rgba(76, 175, 80, 0.5)', 'rgba(244, 67, 54, 0.5)'],
        borderColor: ['rgba(76, 175, 80, 1)', 'rgba(244, 67, 54, 1)'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Bảng Xếp Hạng
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
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
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={timeFrame}
                label="Thời gian"
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                {timeFrames.map((tf) => (
                  <MenuItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Xếp hạng" />
            <Tab label="Thống kê" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 ? (
          // Rankings Tab
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hạng</TableCell>
                  <TableCell>Người chơi</TableCell>
                  <TableCell align="right">Điểm số</TableCell>
                  <TableCell align="right">Số game</TableCell>
                  <TableCell align="right">Câu đúng</TableCell>
                  <TableCell align="right">Độ chính xác</TableCell>
                  <TableCell align="right">Thời gian TB</TableCell>
                  <TableCell align="right">Lần chơi cuối</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((player, index) => (
                  <TableRow
                    key={player._id || index}
                    hover
                    onClick={() => handlePlayerClick(player.name)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell align="right">{player.score || 0}</TableCell>
                    <TableCell align="right">{player.totalQuestions || 0}</TableCell>
                    <TableCell align="right">
                      {player.correctAnswers || 0}/{player.totalQuestions || 0}
                    </TableCell>
                    <TableCell align="right">
                      {((player.correctAnswers || 0) / (player.totalQuestions || 1) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell align="right">
                      {(player.averageTime || 0).toFixed(1)}s
                    </TableCell>
                    <TableCell align="right">
                      {player.lastPlayed ? new Date(player.lastPlayed).toLocaleString('vi-VN') : 'Chưa chơi'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // Statistics Tab
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hiệu suất theo chủ đề
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={{
                        labels: categoryData.labels,
                        datasets: [
                          {
                            label: 'Điểm trung bình',
                            data: categoryData.datasets[0].data,
                            backgroundColor: categoryData.datasets[0].backgroundColor,
                            borderColor: categoryData.datasets[0].borderColor,
                            borderWidth: 1
                          },
                          {
                            label: 'Độ chính xác trung bình',
                            data: categoryData.datasets[1].data,
                            backgroundColor: categoryData.datasets[1].backgroundColor,
                            borderColor: categoryData.datasets[1].borderColor,
                            borderWidth: 1
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Phần trăm (%)'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Thống kê theo chủ đề'
                          }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Accuracy
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <Doughnut
                      data={accuracyData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default Leaderboard; 