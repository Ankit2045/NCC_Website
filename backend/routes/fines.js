const express = require('express');
const router = express.Router();
const Fine = require('../models/Fine');

// GET all fines
router.get('/', async (req, res) => {
    try {
        const fines = await Fine.find({});
        res.json(fines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT pay a fine
router.put('/:id/pay', async (req, res) => {
    try {
        const fine = await Fine.findById(req.params.id);
        if (!fine) return res.status(404).json({ message: 'Fine record not found' });

        fine.status = 'Paid';
        fine.datePaid = new Date().toISOString().split('T')[0];
        await fine.save();

        res.json(fine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
