require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Squadron = require('./models/Squadron');
const Cadet = require('./models/Cadet');
const Attendance = require('./models/Attendance');
const Fine = require('./models/Fine');
const ExemptionRequest = require('./models/ExemptionRequest');
const CompetitionResult = require('./models/CompetitionResult');
const Announcement = require('./models/Announcement');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dtu_ncc');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing database collections
        await User.deleteMany({});
        await Squadron.deleteMany({});
        await Cadet.deleteMany({});
        await Attendance.deleteMany({});
        await Fine.deleteMany({});
        await ExemptionRequest.deleteMany({});
        await CompetitionResult.deleteMany({});
        await Announcement.deleteMany({});
        console.log('Cleared existing collections.');

        // Seed Admin User
        const adminUser = new User({
            email: 'admin@dtuncc.in',
            password: 'admin123', // This will be auto-hashed by User model pre-save hook
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user seeded (admin@dtuncc.in / admin123).');

        // Seed Squadrons with 0 base points
        const squadronsToSeed = [
            { squadronId: 'alpha', name: 'Alpha Squadron', basePoints: 0 },
            { squadronId: 'bravo', name: 'Bravo Squadron', basePoints: 0 },
            { squadronId: 'charlie', name: 'Charlie Squadron', basePoints: 0 },
            { squadronId: 'delta', name: 'Delta Squadron', basePoints: 0 }
        ];
        await Squadron.insertMany(squadronsToSeed);
        console.log('Squadrons seeded with 0 base points.');

        console.log('Database Seeding Completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedDB();
