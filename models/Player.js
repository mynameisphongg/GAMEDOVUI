const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    wrongAnswers: {
        type: Number,
        default: 0
    },
    averageTime: {
        type: Number,
        default: 0
    },
    categoryStats: {
        general: {
            played: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            score: { type: Number, default: 0 }
        },
        science: {
            played: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            score: { type: Number, default: 0 }
        },
        history: {
            played: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            score: { type: Number, default: 0 }
        },
        sports: {
            played: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            score: { type: Number, default: 0 }
        },
        entertainment: {
            played: { type: Number, default: 0 },
            correct: { type: Number, default: 0 },
            score: { type: Number, default: 0 }
        }
    },
    gameHistory: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        question: String,
        answer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number,
        points: Number,
        category: String,
        difficulty: String,
        playedAt: { type: Date, default: Date.now }
    }],
    lastPlayed: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to calculate accuracy
playerSchema.methods.getAccuracy = function() {
    if (this.totalQuestions === 0) return 0;
    return (this.correctAnswers / this.totalQuestions) * 100;
};

// Method to get category accuracy
playerSchema.methods.getCategoryAccuracy = function(category) {
    const stats = this.categoryStats[category];
    if (!stats || stats.played === 0) return 0;
    return (stats.correct / stats.played) * 100;
};

module.exports = mongoose.model('Player', playerSchema);
