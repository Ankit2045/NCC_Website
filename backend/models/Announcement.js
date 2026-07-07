const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    postedBy: {
        type: String,
        default: 'ANO Office'
    }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
