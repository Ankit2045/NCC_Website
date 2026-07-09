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

// DELETE an announcement
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Announcement.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        res.json({ success: true, message: 'Notice deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update an announcement
router.put('/:id', async (req, res) => {
    const { title, body } = req.body;
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        if (title) announcement.title = title;
        if (body) announcement.body = body;
        await announcement.save();
        res.json(announcement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
