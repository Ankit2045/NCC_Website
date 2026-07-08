const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');

// GET all camps
router.get('/', async (req, res) => {
    try {
        const camps = await Camp.find({}).sort({ createdAt: -1 });
        res.json(camps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a camp
router.post('/', async (req, res) => {
    const { title, category, location, duration, description, date } = req.body;

    try {
        const camp = new Camp({
            title,
            category,
            location,
            duration,
            description,
            date
        });
        await camp.save();
        res.status(201).json(camp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
