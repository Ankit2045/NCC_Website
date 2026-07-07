const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema({
    cadetId: {
        type: String, // Maps to Cadet.cadetId
        required: true
    },
    attendanceRecordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance',
        default: null
    },
    amount: {
        type: Number,
        default: 50
    },
    status: {
        type: String,
        enum: ['Unpaid', 'Paid'],
        default: 'Unpaid'
    },
    dateCreated: {
        type: String, // YYYY-MM-DD
        required: true
    },
    datePaid: {
        type: String, // YYYY-MM-DD
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Fine', FineSchema);
