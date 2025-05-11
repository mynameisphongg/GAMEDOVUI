import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Home, SentimentDissatisfied } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          <SentimentDissatisfied
            sx={{ fontSize: 120, color: 'primary.main', mb: 2 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom color="text.secondary">
            Rất tiếc! Không tìm thấy trang
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1.5 }}
            >
              Về Trang Chủ
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFound; 