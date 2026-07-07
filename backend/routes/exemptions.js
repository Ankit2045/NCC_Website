const express = require('express');
const router = express.Router();
const ExemptionRequest = require('../models/ExemptionRequest');
const Attendance = require('../models/Attendance');
const Fine = require('../models/Fine');

// GET all leave requests
router.get('/', async (req, res) => {
    try {
        const requests = await ExemptionRequest.find({});
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST submit a leave request
router.post('/', async (req, res) => {
    const { cadetId, date, reason } = req.body;
    const dateSubmitted = new Date().toISOString().split('T')[0];

    try {
        const request = new ExemptionRequest({
            cadetId,
            date,
            reason,
            status: 'Pending',
            dateSubmitted
        });
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT approve/reject a leave request
router.put('/:id/status', async (req, res) => {
    const { status } = req.body; // 'Approved' or 'Rejected'

    try {
        const request = await ExemptionRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Leave request not found' });

        request.status = status;
        await request.save();

        if (status === 'Approved') {
            // Update or create Attendance as Excused
            let attendance = await Attendance.findOne({ date: request.date, cadetId: request.cadetId });
            if (attendance) {
                attendance.status = 'Excused';
                attendance.markedBy = 'ANO / CQMS Approved';
                await attendance.save();
            } else {
                attendance = new Attendance({
                    date: request.date,
                    cadetId: request.cadetId,
                    status: 'Excused',
                    markedBy: 'ANO / CQMS Approved'
                });
                await attendance.save();
            }

            // Remove any unpaid fine associated with this date/cadet
            await Fine.findOneAndDelete({ cadetId: request.cadetId, dateCreated: request.date, status: 'Unpaid' });
        }

        res.json(request);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
