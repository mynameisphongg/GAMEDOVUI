import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, Timer, Category, TrendingUp } from '@mui/icons-material';
import useSound from 'use-sound';

// Import sound effects
import bgMusic from '../assets/sounds/bg-music.mp3';

const features = [
  {
    icon: <Category sx={{ fontSize: 40 }} />,
    title: 'Nhiều Chủ Đề',
    description: 'Chọn từ nhiều chủ đề khác nhau như Khoa học, Lịch sử, Thể thao và nhiều hơn nữa!',
  },
  {
    icon: <Timer sx={{ fontSize: 40 }} />,
    title: 'Thử Thách Thời Gian',
    description: 'Kiểm tra kiến thức của bạn dưới áp lực thời gian với các câu hỏi có giới hạn!',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 40 }} />,
    title: 'Độ Khó Tăng Dần',
    description: 'Câu hỏi sẽ khó dần khi bạn tiến bộ, với điểm thưởng cho câu trả lời nhanh!',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40 }} />,
    title: 'Bảng Xếp Hạng Toàn Cầu',
    description: 'Cạnh tranh với người chơi trên toàn thế giới và leo lên bảng xếp hạng!',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [playBgMusic, { stop: stopBgMusic }] = useSound(bgMusic, { 
    volume: 0.3,
    loop: true 
  });

  // Play background music when component mounts
  useEffect(() => {
    playBgMusic();
    return () => stopBgMusic();
  }, [playBgMusic, stopBgMusic]);

  const handleStartGame = () => {
    stopBgMusic(); // Stop music when starting game
    navigate('/game');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(45deg, ${theme.palette.background.default} 30%, ${theme.palette.background.paper} 90%)`,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
              mt: 4,
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Thử Thách Quiz Game
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Kiểm tra kiến thức, thách đấu bạn bè và trở thành bậc thầy quiz!
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleStartGame}
                startIcon={<EmojiEvents />}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.2rem',
                  borderRadius: 4,
                }}
              >
                Bắt Đầu Chơi Ngay
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: 'background.paper',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* How to Play Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" component="h2" gutterBottom>
              Cách Chơi
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Làm theo các bước đơn giản sau để bắt đầu cuộc phiêu lưu quiz của bạn
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                step: '1',
                title: 'Chọn Chủ Đề',
                description: 'Chọn chủ đề yêu thích hoặc thử thách bản thân với chủ đề ngẫu nhiên',
              },
              {
                step: '2',
                title: 'Trả Lời Câu Hỏi',
                description: 'Đọc kỹ và chọn câu trả lời đúng trong thời gian quy định',
              },
              {
                step: '3',
                title: 'Ghi Điểm',
                description: 'Nhận điểm cho câu trả lời đúng và điểm thưởng cho câu trả lời nhanh',
              },
              {
                step: '4',
                title: 'Leo Hạng',
                description: 'Cạnh tranh với người chơi khác và cố gắng đạt top bảng xếp hạng',
              },
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'visible',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 1,
                      },
                    }}
                  >
                    <CardContent sx={{ pt: 6, textAlign: 'center' }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home; 