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
        enum: ['alpha', 'bravo', 'charlie', 'delta', 'hq'],
        required: true,
        lowercase: true
    },
    rank: {
        type: String,
        enum: ['Cadet', 'L/CPL', 'CPL', 'SGT', 'CQMS', 'CSM', 'JUO', 'SUO'],
        default: 'Cadet'
    },
    wing: {
        type: String,
        default: 'Army'
    },
    year: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
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
    },
    college: {
        type: String,
        required: true,
        trim: true
    },
    dliNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    bloodGroup: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        trim: true
    },
    branch: {
        type: String,
        trim: true
    },
    collegeRollNo: {
        type: String,
        trim: true
    },
    academicYear: {
        type: String,
        trim: true
    },
    altContact: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    residenceType: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    fatherName: {
        type: String,
        trim: true
    },
    motherName: {
        type: String,
        trim: true
    },
    guardianName: {
        type: String,
        trim: true
    },
    allergies: {
        type: String,
        trim: true
    },
    medicalConditions: {
        type: String,
        trim: true
    },
    medications: {
        type: String,
        trim: true
    },
    campsAttended: {
        type: String,
        trim: true
    },
    otherDetails: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Cadet', CadetSchema);
