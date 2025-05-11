const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Question = require('../models/Question');

// Nộp kết quả chơi
router.post('/submit', async (req, res) => {
    try {
        const { name, category, score, answers } = req.body;

        // Kiểm tra xem người chơi đã có điểm trong chủ đề này chưa
        const existingPlayer = await Player.findOne({
            name: name,
            'categoryStats.category': category
        });

        if (existingPlayer) {
            return res.status(409).json({ 
                message: 'Tên này đã được sử dụng trong chủ đề này. Vui lòng chọn tên khác hoặc chọn chủ đề khác.' 
            });
        }

        let totalScore = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let totalTime = 0;
        const gameHistory = [];
        const categoryStats = {
            general: { played: 0, correct: 0, score: 0 },
            science: { played: 0, correct: 0, score: 0 },
            history: { played: 0, correct: 0, score: 0 },
            sports: { played: 0, correct: 0, score: 0 },
            entertainment: { played: 0, correct: 0, score: 0 }
        };

        // Tính điểm cho từng câu trả lời
        for (const answer of answers) {
            const { questionId, answer: playerAnswer, time, isCorrect } = answer;
            const question = await Question.findById(questionId);
            
            if (!question) {
                console.error(`Question not found: ${questionId}`);
                continue;
            }

            let points = 0;
            if (isCorrect) {
                const basePoints = question.points;
                const timeBonus = Math.max(0, (question.timeLimit - time) / question.timeLimit);
                const difficultyMultiplier = {
                    'easy': 1,
                    'medium': 1.5,
                    'hard': 2
                }[question.difficulty];

                points = Math.round(basePoints * difficultyMultiplier * (1 + timeBonus));
                totalScore += points;
                correctAnswers++;
                categoryStats[question.category].correct++;
            } else {
                wrongAnswers++;
            }

            totalTime += time;
            categoryStats[question.category].played++;
            categoryStats[question.category].score += points;

            gameHistory.push({
                questionId: question._id,
                question: question.question,
                answer: playerAnswer || 'No answer provided',
                correctAnswer: question.answer,
                isCorrect: isCorrect,
                timeSpent: time || 0,
                points: points,
                category: question.category,
                difficulty: question.difficulty,
                playedAt: new Date()
            });
        }

        // Tìm hoặc tạo player mới
        let player = await Player.findOne({ name });
        if (!player) {
            player = new Player({ 
                name,
                totalScore: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                wrongAnswers: 0,
                averageTime: 0,
                categoryStats: categoryStats,
                recentGames: [],
                gameHistory: []
            });
        }

        // Cập nhật thông tin player
        player.totalScore += totalScore;
        player.correctAnswers += correctAnswers;
        player.totalQuestions += answers.length;
        player.wrongAnswers += wrongAnswers;
        player.averageTime = (player.averageTime * (player.totalQuestions - answers.length) + totalTime) / player.totalQuestions;
        
        // Cập nhật thống kê theo category
        for (const category in categoryStats) {
            if (!player.categoryStats[category]) {
                player.categoryStats[category] = { played: 0, correct: 0, score: 0 };
            }
            player.categoryStats[category].played += categoryStats[category].played;
            player.categoryStats[category].correct += categoryStats[category].correct;
            player.categoryStats[category].score += categoryStats[category].score;
        }

        // Thêm game history mới vào đầu mảng
        player.gameHistory = [...gameHistory, ...(player.gameHistory || [])].slice(0, 100);

        // Thêm game gần đây
        if (!player.recentGames) {
            player.recentGames = [];
        }
        
        player.recentGames.unshift({
            date: new Date(),
            category,
            points: totalScore,
            correct: correctAnswers,
            total: answers.length,
            timeSpent: totalTime
        });

        // Giới hạn số lượng game gần đây
        if (player.recentGames.length > 10) {
            player.recentGames = player.recentGames.slice(0, 10);
        }

        player.lastPlayed = new Date();
        
        await player.save();

        res.json({
            message: 'Result saved',
            score: totalScore,
            totalScore: player.totalScore,
            correctAnswers,
            wrongAnswers,
            accuracy: player.getAccuracy(),
            averageTime: player.averageTime,
            categoryStats: player.categoryStats,
            recentGames: player.recentGames
        });
    } catch (error) {
        console.error('Error in submit route:', error);
        res.status(400).json({ message: error.message });
    }
});

// Lấy bảng xếp hạng
router.get('/leaderboard', async (req, res) => {
    try {
        const { category, timeFrame } = req.query;
        let startDate;

        // Lọc theo thời gian nếu có
        if (timeFrame && timeFrame !== 'all') {
            const now = new Date();
            switch (timeFrame) {
                case 'daily':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case 'weekly':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'monthly':
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
                    break;
            }
        }

        // Lấy tất cả người chơi
        const players = await Player.find({ totalQuestions: { $gt: 0 } });

        // Lọc và tính toán điểm số dựa trên game history
        const filteredPlayers = players.map(player => {
            // Lọc game history theo category và timeFrame
            let relevantGames = player.gameHistory || [];
            
            if (category && category !== 'all') {
                // Chỉ lấy các game thuộc chủ đề được chọn
                relevantGames = relevantGames.filter(game => game.category === category);
            }
            
            if (startDate) {
                // Lọc theo thời gian nếu có
                relevantGames = relevantGames.filter(game => new Date(game.playedAt) >= startDate);
            }

            // Nếu không có game nào phù hợp với bộ lọc, bỏ qua người chơi này
            if (relevantGames.length === 0) {
                return null;
            }

            // Tính toán thống kê từ các game đã lọc
            const stats = {
                name: player.name,
                score: 0,
                totalQuestions: relevantGames.length,
                correctAnswers: 0,
                wrongAnswers: 0,
                averageTime: 0,
                categoryStats: {
                    general: { played: 0, correct: 0, score: 0 },
                    science: { played: 0, correct: 0, score: 0 },
                    history: { played: 0, correct: 0, score: 0 },
                    sports: { played: 0, correct: 0, score: 0 },
                    entertainment: { played: 0, correct: 0, score: 0 }
                },
                lastPlayed: null
            };

            // Tính toán thống kê từ các game đã lọc
            relevantGames.forEach(game => {
                stats.score += game.points || 0;
                if (game.isCorrect) {
                    stats.correctAnswers++;
                    stats.categoryStats[game.category].correct++;
                } else {
                    stats.wrongAnswers++;
                }
                stats.categoryStats[game.category].played++;
                stats.categoryStats[game.category].score += game.points || 0;
                stats.averageTime += game.timeSpent || 0;
            });

            // Tính trung bình thời gian
            if (relevantGames.length > 0) {
                stats.averageTime /= relevantGames.length;
            }

            // Lấy thời gian chơi gần nhất
            if (relevantGames.length > 0) {
                stats.lastPlayed = new Date(Math.max(...relevantGames.map(g => new Date(g.playedAt))));
            }

            return stats;
        }).filter(player => player !== null); // Loại bỏ những người chơi không có game phù hợp

        // Sắp xếp theo điểm số
        filteredPlayers.sort((a, b) => b.score - a.score);

        // Giới hạn 10 người chơi hàng đầu
        const leaderboard = filteredPlayers.slice(0, 10);

        // Log để debug
        console.log(`Leaderboard for category: ${category}, timeFrame: ${timeFrame}`);
        console.log(`Total players found: ${filteredPlayers.length}`);
        console.log('Top 3 players:', leaderboard.slice(0, 3).map(p => ({
            name: p.name,
            score: p.score,
            category: category,
            gamesPlayed: p.totalQuestions
        })));

        res.json(leaderboard);
    } catch (error) {
        console.error('Error in leaderboard route:', error);
        res.status(400).json({ message: error.message });
    }
});

// Lấy thống kê của player
router.get('/stats/:name', async (req, res) => {
    try {
        const player = await Player.findOne({ name: req.params.name });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Chỉ trả về thống kê nếu người chơi đã chơi ít nhất 1 game
        if (player.totalQuestions === 0) {
            return res.json({
                name: player.name,
                message: 'No games played yet'
            });
        }

        const stats = {
            name: player.name,
            totalScore: player.totalScore,
            totalQuestions: player.totalQuestions,
            correctAnswers: player.correctAnswers,
            wrongAnswers: player.wrongAnswers,
            accuracy: player.getAccuracy(),
            averageTime: player.averageTime,
            categoryStats: player.categoryStats,
            recentGames: player.gameHistory
                .sort((a, b) => b.playedAt - a.playedAt)
                .slice(0, 10)
                .map(game => ({
                    ...game,
                    playedAt: game.playedAt.toLocaleString()
                }))
        };

        res.json(stats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Thêm endpoint mới để kiểm tra tên trùng
router.get('/check/:name/:category', async (req, res) => {
    try {
        const { name, category } = req.params;
        
        // Kiểm tra xem người chơi đã có điểm trong chủ đề này chưa
        const existingPlayer = await Player.findOne({
            name: name,
            'categoryStats.category': category
        });

        res.json({ exists: !!existingPlayer });
    } catch (err) {
        console.error('Error checking player name:', err);
        res.status(500).json({ message: 'Lỗi khi kiểm tra tên người chơi' });
    }
});

module.exports = router;
