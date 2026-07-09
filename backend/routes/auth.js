const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cadet = require('../models/Cadet');
const sendEmail = require('../utils/sendEmail');

// In-memory store for mock OTPs
const otpStore = new Map();

// @route   POST /api/auth/send-otp
// @desc    Send an OTP to email or phone (via SMTP for email, mock for phone)
router.post('/send-otp', async (req, res) => {
    const { target } = req.body;
    if (!target) {
        return res.status(400).json({ message: 'Target email/phone is required.' });
    }
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(target, otp);
    
    // Check if target is an email address
    if (target.includes('@')) {
        try {
            const emailResult = await sendEmail({
                to: target,
                subject: '1 DBN NCC Unit - Verification OTP',
                text: `Hello, your 1 DBN NCC Cadet Portal verification OTP is: ${otp}. This code is valid for 15 minutes.`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #FF9933; text-align: center;">1 DBN NCC Cadet Subunit</h2>
                    <hr/>
                    <p>Hello,</p>
                    <p>Your verification OTP code for the Cadet Portal is:</p>
                    <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f7f7f7; border: 1px dashed #128807; color: #128807;">
                        ${otp}
                    </div>
                    <p>This code is valid for 15 minutes. Please do not share this OTP with anyone.</p>
                    <br/>
                    <p>Best Regards,<br/><strong>1 DBN NCC Unit Admin</strong></p>
                </div>`
            });

            if (emailResult.mock) {
                return res.json({ message: `Mock OTP sent to ${target} (check server console)`, otp });
            }

            return res.json({ message: `OTP sent successfully to ${target}` });
        } catch (error) {
            console.error('Error in send-otp route:', error);
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
        }
    } else {
        // For phone target, keep simulated OTP
        res.json({ message: `Mock OTP sent to ${target}`, otp });
    }
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
            dob: "2004-01-01",
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
            dob: "2004-02-02",
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
            dob: "2004-03-03",
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
            dob: "2004-04-04",
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
            dob: "2005-05-05",
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
        name, enrollmentNo, squadron, rank, wing, year, contact, email, password, dob,
        college, dliNo, bloodGroup, course, branch, collegeRollNo, academicYear,
        altContact, address, residenceType, city, pincode, fatherName, motherName,
        guardianName, allergies, medicalConditions, medications, campsAttended, otherDetails
    } = req.body;

    const phoneRegex = /^\d{10}$/;
    if (!contact || !phoneRegex.test(contact)) {
        return res.status(400).json({ message: 'A valid 10-digit mobile number is required.' });
    }

    if (!dob) {
        return res.status(400).json({ message: 'Date of Birth is required.' });
    }

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
            dob,
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

// @route   POST /api/auth/recover-account
// @desc    Verify name, dob, mobile to retrieve login email ID and send a password-reset OTP
router.post('/recover-account', async (req, res) => {
    const { name, dob, contact } = req.body;

    if (!name || !dob || !contact) {
        return res.status(400).json({ message: 'Name, Date of Birth, and mobile number are required.' });
    }

    try {
        // Look up cadet by name (case-insensitive regex), dob, and contact
        const cadet = await Cadet.findOne({
            name: { $regex: new RegExp("^" + name.trim() + "$", "i") },
            dob: dob.trim(),
            contact: contact.trim()
        });

        if (!cadet) {
            return res.status(404).json({ message: 'No registered cadet found matching these recovery details.' });
        }

        const registeredEmail = cadet.email;

        // Verify that the user account actually exists for this email
        const user = await User.findOne({ email: registeredEmail });
        if (!user) {
            return res.status(404).json({ message: 'No user account exists for this cadet profile.' });
        }

        // Generate password-reset OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(registeredEmail, otp);

        // Send recovery email
        const emailResult = await sendEmail({
            to: registeredEmail,
            subject: '1 DBN NCC Unit - Account Recovery Verification',
            text: `Hello ${cadet.name},\n\nYour registered Official Email Address (Login ID) is: ${registeredEmail}\n\nYour account recovery verification OTP code is: ${otp}.\n\nThis code is valid for 15 minutes.\n\nBest Regards,\n1 DBN NCC Unit Admin`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #FF9933; text-align: center;">1 DBN NCC Cadet Subunit</h2>
                <hr/>
                <p>Hello <strong>${cadet.name}</strong>,</p>
                <p>You requested to recover your account credentials.</p>
                <p>Your registered Official Email Address (Login ID) is:</p>
                <div style="font-size: 18px; font-weight: bold; text-align: center; margin: 15px 0; padding: 10px; background-color: #f7f7f7; border: 1px solid #ddd; color: #128807;">
                    ${registeredEmail}
                </div>
                <p>Your password reset OTP code is:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f7f7f7; border: 1px dashed #FF9933; color: #FF9933;">
                    ${otp}
                </div>
                <p>Enter this OTP code on the recovery screen to set your new password. This code is valid for 15 minutes.</p>
                <br/>
                <p>Best Regards,<br/><strong>1 DBN NCC Unit Admin</strong></p>
            </div>`
        });

        let responseMsg = 'Recovery verification OTP has been sent to your registered email.';
        if (emailResult.mock) {
            responseMsg = `[Mock Mode] OTP sent (check server console)`;
        }

        res.json({
            success: true,
            email: registeredEmail,
            message: responseMsg,
            otp: emailResult.mock ? otp : undefined
        });
    } catch (err) {
        console.error('Error in recover-account route:', err);
        res.status(500).json({ message: 'Server error recovering account.' });
    }
});

// @route   POST /api/auth/forgot-id
// @desc    Retrieve official email address using DLI number and contact number
router.post('/forgot-id', async (req, res) => {
    const { enrollmentNo, contact } = req.body;

    if (!enrollmentNo || !contact) {
        return res.status(400).json({ message: 'DLI/Enrollment number and mobile number are required.' });
    }

    try {
        const cadet = await Cadet.findOne({ 
            $or: [
                { enrollmentNo: enrollmentNo.trim() },
                { dliNo: enrollmentNo.trim() }
            ],
            contact: contact.trim()
        });

        if (!cadet) {
            return res.status(404).json({ message: 'No registered cadet found matching these details.' });
        }

        const registeredEmail = cadet.email;

        // Send email with registered ID (email)
        const emailResult = await sendEmail({
            to: registeredEmail,
            subject: '1 DBN NCC Unit - Login ID Recovery',
            text: `Hello ${cadet.name},\n\nYour registered Official Email Address (Login ID) for the 1 DBN NCC Cadet Portal is:\n\n${registeredEmail}\n\nYou can use this ID to sign in at the cadet portal.\n\nBest Regards,\n1 DBN NCC Unit Admin`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #FF9933; text-align: center;">1 DBN NCC Cadet Subunit</h2>
                <hr/>
                <p>Hello <strong>${cadet.name}</strong>,</p>
                <p>You requested to recover your login credentials for the Cadet Portal.</p>
                <p>Your registered Official Email Address (Login ID) is:</p>
                <div style="font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; background-color: #f7f7f7; border: 1px solid #ddd; color: #128807;">
                    ${registeredEmail}
                </div>
                <p>You can use this email address to log in or to reset your password if needed.</p>
                <br/>
                <p>Best Regards,<br/><strong>1 DBN NCC Unit Admin</strong></p>
            </div>`
        });

        let responseMsg = 'Your Login ID has been sent to your registered email address.';
        if (emailResult.mock) {
            responseMsg = `[Mock Mode] Login ID is ${registeredEmail} (sent to server console)`;
        }

        res.json({ success: true, message: responseMsg, email: emailResult.mock ? registeredEmail : undefined });
    } catch (err) {
        console.error('Error in forgot-id route:', err);
        res.status(500).json({ message: 'Server error recovering Login ID.' });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Generate password-reset OTP and send to official email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: 'No registered account found with this email address.' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email.toLowerCase().trim(), otp);

        const emailResult = await sendEmail({
            to: email,
            subject: '1 DBN NCC Unit - Password Reset OTP',
            text: `Hello,\n\nYour 1 DBN NCC Cadet Portal password reset OTP code is: ${otp}.\n\nThis code is valid for 15 minutes. If you did not request this, please ignore this email.\n\nBest Regards,\n1 DBN NCC Unit Admin`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #FF9933; text-align: center;">1 DBN NCC Cadet Subunit</h2>
                <hr/>
                <p>Hello,</p>
                <p>You requested a password reset for your Cadet Portal account.</p>
                <p>Your password reset OTP code is:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f7f7f7; border: 1px dashed #FF9933; color: #FF9933;">
                    ${otp}
                </div>
                <p>This code is valid for 15 minutes. If you did not request a password reset, please secure your account.</p>
                <br/>
                <p>Best Regards,<br/><strong>1 DBN NCC Unit Admin</strong></p>
            </div>`
        });

        let responseMsg = 'A password reset OTP has been sent to your official email.';
        if (emailResult.mock) {
            responseMsg = `[Mock Mode] OTP sent (check server console)`;
        }

        res.json({ 
            success: true, 
            message: responseMsg, 
            otp: emailResult.mock ? otp : undefined 
        });
    } catch (err) {
        console.error('Error in forgot-password route:', err);
        res.status(500).json({ message: 'Server error sending password reset OTP.' });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and reset user password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    try {
        const targetEmail = email.toLowerCase().trim();
        const expectedOtp = otpStore.get(targetEmail);

        if (!expectedOtp || expectedOtp !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid or expired OTP code.' });
        }

        const user = await User.findOne({ email: targetEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Set and save new password
        user.password = newPassword;
        await user.save();

        // Clear OTP
        otpStore.delete(targetEmail);

        res.json({ success: true, message: 'Password reset successful! You can now log in.' });
    } catch (err) {
        console.error('Error in reset-password route:', err);
        res.status(500).json({ message: 'Server error resetting password.' });
    }
});

module.exports = router;
