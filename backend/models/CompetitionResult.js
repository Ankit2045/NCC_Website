const mongoose = require('mongoose');

const CompetitionResultSchema = new mongoose.Schema({
    compId: {
        type: String, // 'cross-country', 'quarter-guard', etc.
        required: true
    },
    compName: {
        type: String,
        required: true
    },
    compType: {
        type: String,
        enum: ['Athletics', 'Major'],
        required: true
    },
    squadronId: {
        type: String, // 'alpha', 'bravo', 'charlie', 'delta'
        required: true
    },
    position: {
        type: Number, // 1, 2, 3, 4
        required: true
    },
    pointsAwarded: {
        type: Number,
        required: true
    },
    dateRecorded: {
        type: String, // YYYY-MM-DD
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CompetitionResult', CompetitionResultSchema);
