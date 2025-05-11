const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, 'Options must be exactly 4']
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['general', 'science', 'history', 'sports', 'entertainment']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    points: {
        type: Number,
        required: true,
        default: 10
    },
    timeLimit: {
        type: Number,
        required: true,
        default: 30
    }
});

function arrayLimit(val) {
    return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
