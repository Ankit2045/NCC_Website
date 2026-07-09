const express = require('express');
const router = express.Router();
const Cadet = require('../models/Cadet');
const User = require('../models/User');

// GET all cadets
router.get('/', async (req, res) => {
    try {
        const cadets = await Cadet.find({});
        res.json(cadets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a cadet
router.post('/', async (req, res) => {
    const {
        name, enrollmentNo, squadron, rank, wing, year, contact, email, dob,
        college, dliNo, bloodGroup, course, branch, collegeRollNo, academicYear,
        altContact, address, residenceType, pgLocation, hostelNo, city, pincode, fatherName, motherName,
        guardianName, allergies, medicalConditions, medications, campsAttended, otherDetails
    } = req.body;

    try {
        // Generate cadetId (C001, C002 etc)
        const count = await Cadet.countDocuments({});
        const cadetId = "C" + String(count + 1).padStart(3, '0');

        const defCollege = college || 'DTU';
        const defDliNo = dliNo || 'DL2024' + Math.floor(100000 + Math.random() * 900000);
        const defBloodGroup = bloodGroup || 'O+';

        const cadet = new Cadet({
            cadetId,
            name,
            enrollmentNo,
            squadron,
            rank,
            wing,
            year,
            dob,
            contact,
            email,
            college: defCollege,
            dliNo: defDliNo,
            bloodGroup: defBloodGroup,
            course,
            branch,
            collegeRollNo,
            academicYear,
            altContact,
            address,
            residenceType,
            pgLocation,
            hostelNo,
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
            approved: true
        });

        const savedCadet = await cadet.save();

        let role = 'cadet';
        if (rank === 'SUO') role = 'suo';
        else if (rank === 'CSM') role = 'csm';
        else if (rank === 'CQMS') role = 'cqms';

        // Create login account
        const user = new User({
            email,
            password: 'cadet123', // default password
            role,
            cadetId: savedCadet._id
        });
        await user.save();

        res.status(201).json(savedCadet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a cadet
router.put('/:id', async (req, res) => {
    const {
        name, enrollmentNo, squadron, rank, wing, year, contact, email, dob,
        college, dliNo, bloodGroup, course, branch, collegeRollNo, academicYear,
        altContact, address, residenceType, pgLocation, hostelNo, city, pincode, fatherName, motherName,
        guardianName, allergies, medicalConditions, medications, campsAttended, otherDetails
    } = req.body;

    try {
        const cadet = await Cadet.findById(req.params.id);
        if (!cadet) return res.status(404).json({ message: 'Cadet not found' });

        const oldEmail = cadet.email;

        cadet.name = name;
        cadet.enrollmentNo = enrollmentNo;
        cadet.squadron = squadron;
        cadet.rank = rank;
        cadet.wing = wing;
        cadet.year = year;
        cadet.contact = contact;
        cadet.email = email;
        if (dob) cadet.dob = dob;

        if (college) cadet.college = college;
        if (dliNo) cadet.dliNo = dliNo;
        if (bloodGroup) cadet.bloodGroup = bloodGroup;
        if (course !== undefined) cadet.course = course;
        if (branch !== undefined) cadet.branch = branch;
        if (collegeRollNo !== undefined) cadet.collegeRollNo = collegeRollNo;
        if (academicYear !== undefined) cadet.academicYear = academicYear;
        if (altContact !== undefined) cadet.altContact = altContact;
        if (address !== undefined) cadet.address = address;
        if (residenceType !== undefined) cadet.residenceType = residenceType;
        if (pgLocation !== undefined) cadet.pgLocation = pgLocation;
        if (hostelNo !== undefined) cadet.hostelNo = hostelNo;
        if (city !== undefined) cadet.city = city;
        if (pincode !== undefined) cadet.pincode = pincode;
        if (fatherName !== undefined) cadet.fatherName = fatherName;
        if (motherName !== undefined) cadet.motherName = motherName;
        if (guardianName !== undefined) cadet.guardianName = guardianName;
        if (allergies !== undefined) cadet.allergies = allergies;
        if (medicalConditions !== undefined) cadet.medicalConditions = medicalConditions;
        if (medications !== undefined) cadet.medications = medications;
        if (campsAttended !== undefined) cadet.campsAttended = campsAttended;
        if (otherDetails !== undefined) cadet.otherDetails = otherDetails;

        const updatedCadet = await cadet.save();

        let role = 'cadet';
        if (rank === 'SUO') role = 'suo';
        else if (rank === 'CSM') role = 'csm';
        else if (rank === 'CQMS') role = 'cqms';
        else if (rank === 'JUO') role = 'juo';

        // Update corresponding User account email & role
        await User.findOneAndUpdate({ email: oldEmail }, { email, role });

        res.json(updatedCadet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE cadet
router.delete('/:id', async (req, res) => {
    try {
        const cadet = await Cadet.findById(req.params.id);
        if (!cadet) return res.status(404).json({ message: 'Cadet not found' });

        // Delete user
        await User.findOneAndDelete({ email: cadet.email });

        // Delete cadet
        await Cadet.findByIdAndDelete(req.params.id);

        res.json({ message: 'Cadet deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET pending approval cadets
router.get('/pending/all', async (req, res) => {
    try {
        const pending = await Cadet.find({ approved: false });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT approve cadet
router.put('/approve/:id', async (req, res) => {
    try {
        const cadet = await Cadet.findById(req.params.id);
        if (!cadet) return res.status(404).json({ message: 'Cadet not found' });
        
        cadet.approved = true;
        await cadet.save();
        
        res.json({ message: 'Cadet registration approved successfully!', cadet });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
