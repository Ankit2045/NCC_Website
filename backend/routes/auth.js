const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cadet = require('../models/Cadet');

// In-memory store for mock OTPs
const otpStore = new Map();

// @route   POST /api/auth/send-otp
// @desc    Simulate sending an OTP to email or phone
router.post('/send-otp', (req, res) => {
    const { target } = req.body;
    if (!target) {
        return res.status(400).json({ message: 'Target email/phone is required.' });
    }
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(target, otp);
    
    // For demonstration, return the OTP back in the API response so the UI can prompt the user
    res.json({ message: `Mock OTP sent to ${target}`, otp });
});

// @route   POST /api/auth/verify-otp
// @desc    Verify a simulated OTP
router.post('/verify-otp', (req, res) => {
    const { target, otp } = req.body;
    if (!target || !otp) {
        return res.status(400).json({ message: 'Target and OTP are required.' });
    }
    const expectedOtp = otpStore.get(target);
    if (expectedOtp && expectedOtp === otp.toString()) {
        otpStore.delete(target); // clean up
        return res.json({ success: true, message: 'Verified successfully!' });
    }
    res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
});

// @route   POST /api/auth/login
// @desc    Auth user & return credentials
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        let cadetDetails = null;
        if (user.cadetId) {
            cadetDetails = await Cadet.findById(user.cadetId);
            if (cadetDetails && !cadetDetails.approved) {
                return res.status(400).json({ message: 'Your registration is pending approval by the ANO/CQMS.' });
            }
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

        // 1. Seed Cadet Profiles for SUO, CSM, CQMS
        const suoCadet = new Cadet({
            cadetId: "C001",
            name: "SUO Piyush Kumar",
            enrollmentNo: "DEL/SD/24/4801",
            squadron: "hq",
            rank: "SUO",
            wing: "Army",
            year: 3,
            contact: "9876543210",
            email: "suo@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ001",
            bloodGroup: "O+",
            approved: true
        });
        await suoCadet.save();

        const csmCadet = new Cadet({
            cadetId: "C002",
            name: "CSM Akshat Tiwari",
            enrollmentNo: "DEL/SD/24/4802",
            squadron: "hq",
            rank: "CSM",
            wing: "Army",
            year: 3,
            contact: "9876543211",
            email: "csm@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ002",
            bloodGroup: "A+",
            approved: true
        });
        await csmCadet.save();

        const cqmsCadet = new Cadet({
            cadetId: "C003",
            name: "CQMS Ankit Singh",
            enrollmentNo: "DEL/SD/24/4803",
            squadron: "hq",
            rank: "CQMS",
            wing: "Army",
            year: 3,
            contact: "9876543212",
            email: "cqms@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ003",
            bloodGroup: "B+",
            approved: true
        });
        await cqmsCadet.save();

        const juoCadet = new Cadet({
            cadetId: "C004",
            name: "JUO Ankit Kumar",
            enrollmentNo: "DEL/SD/24/4804",
            squadron: "alpha",
            rank: "JUO",
            wing: "Army",
            year: 3,
            contact: "9876543213",
            email: "juo@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024AL004",
            bloodGroup: "AB+",
            approved: true
        });
        await juoCadet.save();

        const cadetCadet = new Cadet({
            cadetId: "C005",
            name: "Cdt Rohit Sharma",
            enrollmentNo: "DEL/SD/24/4805",
            squadron: "alpha",
            rank: "Cadet",
            wing: "Army",
            year: 1,
            contact: "9876543214",
            email: "cadet@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024AL005",
            bloodGroup: "O-",
            approved: true
        });
        await cadetCadet.save();

        // 2. Seed User Accounts linked to Cadet Profiles
        const anoUser = new User({
            email: 'ano@dtuncc.in',
            password: 'ano123',
            role: 'ano'
        });
        await anoUser.save();

        const legacyAdmin = new User({
            email: 'admin@dtuncc.in',
            password: 'admin123',
            role: 'admin'
        });
        await legacyAdmin.save();

        const suoUser = new User({
            email: 'suo@dtuncc.in',
            password: 'suo123',
            role: 'suo',
            cadetId: suoCadet._id
        });
        await suoUser.save();

        const csmUser = new User({
            email: 'csm@dtuncc.in',
            password: 'csm123',
            role: 'csm',
            cadetId: csmCadet._id
        });
        await csmUser.save();

        const cqmsUser = new User({
            email: 'cqms@dtuncc.in',
            password: 'cqms123',
            role: 'cqms',
            cadetId: cqmsCadet._id
        });
        await cqmsUser.save();

        const juoUser = new User({
            email: 'juo@dtuncc.in',
            password: 'juo123',
            role: 'juo',
            cadetId: juoCadet._id
        });
        await juoUser.save();

        const cadetUser = new User({
            email: 'cadet@dtuncc.in',
            password: 'cadet123',
            role: 'cadet',
            cadetId: cadetCadet._id
        });
        await cadetUser.save();

        const squadronsToSeed = [
            { squadronId: 'alpha', name: 'Alpha Squadron', basePoints: 0 },
            { squadronId: 'bravo', name: 'Bravo Squadron', basePoints: 0 },
            { squadronId: 'charlie', name: 'Charlie Squadron', basePoints: 0 },
            { squadronId: 'delta', name: 'Delta Squadron', basePoints: 0 }
        ];
        await Squadron.insertMany(squadronsToSeed);

        // 3. Seed Default Camps
        const Camp = require('../models/Camp');
        await Camp.deleteMany({});
        const defaultCamps = [
            {
                title: "Republic Day Camp (RDC)",
                category: "National Level",
                location: "New Delhi",
                duration: "Annual (January)",
                description: "The pinnacle camp held at Cariappa Parade Ground, Delhi Cantonment. Cadets are selected to represent the Delhi Directorate in guard of honour and PM rally.",
                date: "Jan"
            },
            {
                title: "Thal Sainik Camp (TSC)",
                category: "Adventure",
                location: "DG NCC Delhi",
                duration: "Sept-Oct",
                description: "Specialized military camp focusing on map reading, obstacle clearance courses, health and hygiene, and rifle shooting matches.",
                date: "Sept-Oct"
            },
            {
                title: "Combined Annual Training Camp (CATC)",
                category: "Annual Compulsory",
                location: "Local Battalion Ground",
                duration: "10 Days",
                description: "Mandatory 10-day camp for second and third-year cadets. Required for eligibility to appear for NCC 'B' and 'C' Certificate exams.",
                date: "Variable Dates"
            }
        ];
        await Camp.insertMany(defaultCamps);

        res.json({ message: "Database reset to default settings complete." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const {
        name, enrollmentNo, squadron, rank, wing, year, contact, email, password,
        college, dliNo, bloodGroup, course, branch, collegeRollNo, academicYear,
        altContact, address, residenceType, city, pincode, fatherName, motherName,
        guardianName, allergies, medicalConditions, medications, campsAttended, otherDetails
    } = req.body;

    if (!dliNo || (!dliNo.startsWith('DL2024') && !dliNo.startsWith('DL2025'))) {
        return res.status(400).json({ message: 'DLI number must begin with either DL2024 or DL2025.' });
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
            email,
            college,
            dliNo,
            bloodGroup,
            course,
            branch,
            collegeRollNo,
            academicYear,
            altContact,
            address,
            residenceType,
            city,
            pincode,
            fatherName,
            motherName,
            guardianName,
            allergies,
            medicalConditions,
            medications,
            campsAttended,
            otherDetails,
            approved: false // requires approval
        });

        const savedCadet = await cadet.save();

        let role = 'cadet';
        if (rank === 'SUO') role = 'suo';
        else if (rank === 'CSM') role = 'csm';
        else if (rank === 'CQMS') role = 'cqms';
        else if (rank === 'JUO') role = 'juo';

        const user = new User({
            email,
            password,
            role,
            cadetId: savedCadet._id
        });
        await user.save();

        res.status(201).json({
            message: 'Cadet registered successfully! Wait for approval.',
            cadet: savedCadet
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /api/auth/update-account
router.post('/update-account', async (req, res) => {
    const { userId, email, newPassword, currentPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password. Identity verification failed.' });
        }

        // Update email if provided
        if (email && email.trim() !== '') {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email address is already in use by another user.' });
            }
            user.email = email;
            
            // Also update the email field in the linked Cadet profile if it exists
            if (user.cadetId) {
                const Cadet = require('../models/Cadet');
                await Cadet.findByIdAndUpdate(user.cadetId, { email });
            }
        }

        // Update password if provided
        if (newPassword && newPassword.trim() !== '') {
            user.password = newPassword; // schema will pre-save hash it
        }

        await user.save();
        res.json({ success: true, message: 'Account updated successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
