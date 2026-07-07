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
    const { name, enrollmentNo, squadron, rank, wing, year, contact, email } = req.body;

    if (!email.endsWith('@dtuncc.in')) {
        return res.status(400).json({ message: 'Only official @dtuncc.in emails allowed.' });
    }

    try {
        // Generate cadetId (C001, C002 etc)
        const count = await Cadet.countDocuments({});
        const cadetId = "C" + String(count + 1).padStart(3, '0');

        const cadet = new Cadet({
            cadetId,
            name,
            enrollmentNo,
            squadron,
            rank,
            wing,
            year,
            contact,
            email
        });

        const savedCadet = await cadet.save();

        // Create login account
        const user = new User({
            email,
            password: 'cadet123', // default password
            role: 'cadet',
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
    const { name, enrollmentNo, squadron, rank, wing, year, contact, email } = req.body;

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

        const updatedCadet = await cadet.save();

        // Update corresponding User account email
        await User.findOneAndUpdate({ email: oldEmail }, { email });

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

module.exports = router;
