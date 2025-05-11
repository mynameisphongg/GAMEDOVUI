const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Lấy tất cả câu hỏi
router.get('/', async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
});

// Lấy câu hỏi ngẫu nhiên
router.get('/random', async (req, res) => {
    const { category, difficulty, limit = 10 } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const questions = await Question.aggregate([
        { $match: query },
        { $sample: { size: parseInt(limit) } }
    ]);
    
    res.json(questions);
});

// Lấy câu hỏi theo category
router.get('/category/:category', async (req, res) => {
    const questions = await Question.find({ category: req.params.category });
    res.json(questions);
});

// Lấy câu hỏi theo độ khó
router.get('/difficulty/:difficulty', async (req, res) => {
    const questions = await Question.find({ difficulty: req.params.difficulty });
    res.json(questions);
});

// Thêm câu hỏi mới
router.post('/', async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
