const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// GET all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({ date: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create an announcement
router.post('/', async (req, res) => {
    const { title, body, date, postedBy } = req.body;

    try {
        const notice = new Announcement({
            title,
            body,
            date,
            postedBy
        });
        await notice.save();
        res.status(201).json(notice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
