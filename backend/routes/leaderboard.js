const express = require('express');
const router = express.Router();
const Squadron = require('../models/Squadron');
const CompetitionResult = require('../models/CompetitionResult');
const Attendance = require('../models/Attendance');
const Cadet = require('../models/Cadet');

// GET leaderboard standings (calculated dynamically)
router.get('/', async (req, res) => {
    try {
        const squadrons = await Squadron.find({});
        const results = await CompetitionResult.find({});
        const absences = await Attendance.find({ status: 'Absent' });
        const cadets = await Cadet.find({});

        const leaderboard = squadrons.map(sq => {
            const sqId = sq.squadronId;

            // 1. Base points (0)
            const basePoints = sq.basePoints;

            // 2. Competition wins
            const sqResults = results.filter(r => r.squadronId === sqId);
            const compPoints = sqResults.reduce((acc, curr) => acc + curr.pointsAwarded, 0);

            // 3. Attendance deductions
            // Absences for cadets belonging to this squadron
            let attendanceDeductions = 0;
            const sqCadets = cadets.filter(c => c.squadron === sqId);
            const sqCadetIds = sqCadets.map(c => c.cadetId);

            const sqAbsences = absences.filter(a => sqCadetIds.includes(a.cadetId));
            
            sqAbsences.forEach(abs => {
                const cadet = sqCadets.find(c => c.cadetId === abs.cadetId);
                if (cadet) {
                    if (cadet.year === 3) {
                        attendanceDeductions += 0.20;
                    } else if (cadet.year === 2) {
                        attendanceDeductions += 0.25;
                    }
                }
            });

            // 4. CSM Turnout deductions
            const turnoutDeductions = sq.turnoutDeductions.reduce((acc, curr) => acc + curr.points, 0);

            // 5. SUO Contribution deductions
            const contributionDeductions = sq.contributionDeductions.reduce((acc, curr) => acc + curr.points, 0);

            // Calculate final overall score
            const totalScore = basePoints + compPoints - attendanceDeductions - turnoutDeductions - contributionDeductions;

            return {
                squadronId: sqId,
                name: sq.name,
                basePoints,
                compPoints,
                attendanceDeductions: parseFloat(attendanceDeductions.toFixed(2)),
                turnoutDeductions: parseFloat(turnoutDeductions.toFixed(2)),
                contributionDeductions: parseFloat(contributionDeductions.toFixed(2)),
                totalScore: parseFloat(totalScore.toFixed(2)),
                history: sqResults.map(r => ({
                    compName: r.compName,
                    position: r.position,
                    points: r.pointsAwarded,
                    date: r.dateRecorded
                })),
                turnoutHistory: sq.turnoutDeductions,
                contributionHistory: sq.contributionDeductions
            };
        });

        // Sort descending by totalScore
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST record competition placement
router.post('/competition', async (req, res) => {
    const { compId, compName, compType, squadronId, position, dateRecorded } = req.body;

    // Calculate points based on Inter-Squadron Championship rules:
    let pointsAwarded = 0;
    const pos = parseInt(position);
    if (compType === 'Athletics') {
        if (pos === 1) pointsAwarded = 8;
        else if (pos === 2) pointsAwarded = 6;
        else if (pos === 3) pointsAwarded = 4;
        else if (pos === 4) pointsAwarded = 2;
    } else { // Major
        if (pos === 1) pointsAwarded = 12;
        else if (pos === 2) pointsAwarded = 8;
        else if (pos === 3) pointsAwarded = 6;
        else if (pos === 4) pointsAwarded = 4;
    }

    try {
        const result = new CompetitionResult({
            compId,
            compName,
            compType,
            squadronId,
            position: pos,
            pointsAwarded,
            dateRecorded
        });
        await result.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST record turnout penalty
router.post('/turnout', async (req, res) => {
    const { squadronId, points, date } = req.body;

    try {
        const squadron = await Squadron.findOne({ squadronId });
        if (!squadron) return res.status(404).json({ message: 'Squadron not found' });

        squadron.turnoutDeductions.push({ points: parseFloat(points), date });
        await squadron.save();

        res.json(squadron);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST record contribution penalty
router.post('/contribution', async (req, res) => {
    const { squadronId, points, date } = req.body;

    try {
        const squadron = await Squadron.findOne({ squadronId });
        if (!squadron) return res.status(404).json({ message: 'Squadron not found' });

        squadron.contributionDeductions.push({ points: parseFloat(points), date });
        await squadron.save();

        res.json(squadron);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
