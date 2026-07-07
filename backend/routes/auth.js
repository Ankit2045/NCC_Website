const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cadet = require('../models/Cadet');

// @route   POST /api/auth/login
// @desc    Auth user & return credentials
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials. Only official @dtuncc.in emails allowed.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        let cadetDetails = null;
        if (user.role === 'cadet' && user.cadetId) {
            cadetDetails = await Cadet.findById(user.cadetId);
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                cadetId: user.cadetId
            },
            cadet: cadetDetails
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/reset
router.post('/reset', async (req, res) => {
    try {
        const Squadron = require('../models/Squadron');
        const Cadet = require('../models/Cadet');
        const Attendance = require('../models/Attendance');
        const Fine = require('../models/Fine');
        const ExemptionRequest = require('../models/ExemptionRequest');
        const CompetitionResult = require('../models/CompetitionResult');
        const Announcement = require('../models/Announcement');

        await User.deleteMany({});
        await Squadron.deleteMany({});
        await Cadet.deleteMany({});
        await Attendance.deleteMany({});
        await Fine.deleteMany({});
        await ExemptionRequest.deleteMany({});
        await CompetitionResult.deleteMany({});
        await Announcement.deleteMany({});

        const adminUser = new User({
            email: 'admin@dtuncc.in',
            password: 'admin123',
            role: 'admin'
        });
        await adminUser.save();

        const squadronsToSeed = [
            { squadronId: 'alpha', name: 'Alpha Squadron', basePoints: 0 },
            { squadronId: 'bravo', name: 'Bravo Squadron', basePoints: 0 },
            { squadronId: 'charlie', name: 'Charlie Squadron', basePoints: 0 },
            { squadronId: 'delta', name: 'Delta Squadron', basePoints: 0 }
        ];
        await Squadron.insertMany(squadronsToSeed);

        res.json({ message: "Database reset to default settings complete." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, enrollmentNo, squadron, rank, wing, year, contact, email, password } = req.body;

    if (!email.endsWith('@dtuncc.in')) {
        return res.status(400).json({ message: 'Only official @dtuncc.in emails allowed.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A cadet account with this email already exists.' });
        }

        const count = await Cadet.countDocuments({});
        const cadetId = "C" + String(count + 1).padStart(3, '0');

        const cadet = new Cadet({
            cadetId,
            name,
            enrollmentNo,
            squadron,
            rank,
            wing: wing || 'Army',
            year,
            contact,
            email
        });

        const savedCadet = await cadet.save();

        const user = new User({
            email,
            password,
            role: 'cadet',
            cadetId: savedCadet._id
        });
        await user.save();

        res.status(201).json({
            message: 'Cadet registered successfully!',
            cadet: savedCadet
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
