const mongoose = require('mongoose');

const SquadronSchema = new mongoose.Schema({
    squadronId: {
        type: String, // 'alpha', 'bravo', 'charlie', 'delta'
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    basePoints: {
        type: Number,
        default: 0 // Initialize at 0 points as requested!
    },
    turnoutDeductions: [{
        points: { type: Number, required: true },
        date: { type: String, required: true }
    }],
    contributionDeductions: [{
        points: { type: Number, required: true },
        date: { type: String, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Squadron', SquadronSchema);
