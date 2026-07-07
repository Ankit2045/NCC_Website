const mongoose = require('mongoose');

const ExemptionRequestSchema = new mongoose.Schema({
    cadetId: {
        type: String, // Maps to Cadet.cadetId
        required: true
    },
    date: {
        type: String, // Parade date YYYY-MM-DD
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    dateSubmitted: {
        type: String, // YYYY-MM-DD
        required: true
    }
}, { timestamps: true });

// A cadet can only have one leave request per parade date
ExemptionRequestSchema.index({ date: 1, cadetId: 1 }, { unique: true });

module.exports = mongoose.model('ExemptionRequest', ExemptionRequestSchema);
