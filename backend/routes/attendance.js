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

// POST mark/sync bulk attendance
router.post('/bulk', async (req, res) => {
    const { date, attendanceSheet, markedBy } = req.body;

    try {
        const results = [];
        for (const item of attendanceSheet) {
            const { cadetId, status } = item;
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

            // Sync fines:
            if (status === 'Absent') {
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
                // If cadet is present or excused, clear any unpaid fine for this specific date and cadet
                await Fine.findOneAndDelete({ cadetId, dateCreated: date, status: 'Unpaid' });
            }
            results.push(record);
        }
        res.json({ message: 'Bulk attendance recorded successfully!', count: results.length });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE attendance for a date
router.delete('/date/:date', async (req, res) => {
    const { date } = req.params;
    try {
        await Attendance.deleteMany({ date });
        await Fine.deleteMany({ dateCreated: date, status: 'Unpaid' });
        res.json({ message: `Parade attendance for ${date} removed successfully.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
