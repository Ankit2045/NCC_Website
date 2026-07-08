const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Camp', CampSchema);
