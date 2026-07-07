const mongoose = require('mongoose');

const CadetSchema = new mongoose.Schema({
    cadetId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    enrollmentNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    squadron: {
        type: String,
        enum: ['alpha', 'bravo', 'charlie', 'delta'],
        required: true,
        lowercase: true
    },
    rank: {
        type: String,
        enum: ['Cdt', 'Lcp', 'Cpl', 'Sgt', 'JUO', 'SUO'],
        default: 'Cdt'
    },
    wing: {
        type: String,
        default: 'Army'
    },
    year: {
        type: Number,
        enum: [2, 3],
        required: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Cadet', CadetSchema);
