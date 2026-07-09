const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    eventDate: {
        type: String,
        required: true,
        trim: true
    },
    rules: {
        type: String,
        trim: true
    },
    createdDate: {
        type: String,
        default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    registrations: [{
        squadron: {
            type: String,
            required: true,
            lowercase: true
        },
        registeredBy: {
            type: String,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        participants: [{
            type: String
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Competition', CompetitionSchema);
