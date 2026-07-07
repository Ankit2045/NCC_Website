const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: String, // YYYY-MM-DD format for easy querying and sorting
        required: true
    },
    cadetId: {
        type: String, // Maps to Cadet.cadetId
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Excused'],
        required: true
    },
    markedBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Ensure a cadet can only have one attendance status per day
AttendanceSchema.index({ date: 1, cadetId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
