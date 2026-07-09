const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');

// GET all competitions
router.get('/', async (req, res) => {
    try {
        const list = await Competition.find({}).sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a competition event
router.post('/', async (req, res) => {
    const { name, description, eventDate, rules } = req.body;
    try {
        const comp = new Competition({
            name,
            description,
            eventDate,
            rules
        });
        await comp.save();
        res.status(201).json(comp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST register/update squadron participants
router.post('/:id/register', async (req, res) => {
    const { squadron, registeredBy, participants } = req.body;
    try {
        const comp = await Competition.findById(req.params.id);
        if (!comp) {
            return res.status(404).json({ message: 'Competition not found.' });
        }

        // Clean squadron string
        const sqName = squadron.toLowerCase().trim();

        // Check if registration for this squadron already exists
        const regIndex = comp.registrations.findIndex(r => r.squadron === sqName);
        if (regIndex > -1) {
            // Overwrite existing roster
            comp.registrations[regIndex].registeredBy = registeredBy;
            comp.registrations[regIndex].participants = participants;
            comp.registrations[regIndex].submittedAt = new Date();
        } else {
            // Add new roster
            comp.registrations.push({
                squadron: sqName,
                registeredBy,
                participants,
                submittedAt: new Date()
            });
        }

        await comp.save();
        res.json(comp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a competition
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Competition.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Competition not found.' });
        }
        res.json({ success: true, message: 'Competition deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
