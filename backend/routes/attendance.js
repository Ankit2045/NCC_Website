const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Fine = require('../models/Fine');

// GET all attendance
router.get('/', async (req, res) => {
    try {
        const records = await Attendance.find({});
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST mark/sync attendance
router.post('/', async (req, res) => {
    const { date, cadetId, status, markedBy } = req.body;

    try {
        let record = await Attendance.findOne({ date, cadetId });

        if (record) {
            record.status = status;
            record.markedBy = markedBy;
            await record.save();
        } else {
            record = new Attendance({
                date,
                cadetId,
                status,
                markedBy
            });
            await record.save();
        }

        // Attendance sync engine with Fines:
        if (status === 'Absent') {
            // Generate ₹50 fine if it doesn't already exist
            const fineExists = await Fine.findOne({ cadetId, attendanceRecordId: record._id });
            if (!fineExists) {
                const fine = new Fine({
                    cadetId,
                    attendanceRecordId: record._id,
                    amount: 50,
                    status: 'Unpaid',
                    dateCreated: date
                });
                await fine.save();
            }
        } else {
            // Present or Excused -> Void the unpaid fine if it exists
            await Fine.findOneAndDelete({ cadetId, dateCreated: date, status: 'Unpaid' });
        }

        res.json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
