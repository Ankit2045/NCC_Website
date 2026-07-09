require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Squadron = require('./models/Squadron');
const Camp = require('./models/Camp');
const Cadet = require('./models/Cadet');
const Attendance = require('./models/Attendance');
const Fine = require('./models/Fine');
const ExemptionRequest = require('./models/ExemptionRequest');
const CompetitionResult = require('./models/CompetitionResult');
const Announcement = require('./models/Announcement');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dtu_ncc');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing database collections
        await User.deleteMany({});
        await Squadron.deleteMany({});
        await Camp.deleteMany({});
        await Cadet.deleteMany({});
        await Attendance.deleteMany({});
        await Fine.deleteMany({});
        await ExemptionRequest.deleteMany({});
        await CompetitionResult.deleteMany({});
        await Announcement.deleteMany({});
        console.log('Cleared existing collections.');

        // 1. Seed Cadet Profiles for SUO, CSM, CQMS, JUO
        const suoCadet = new Cadet({
            cadetId: "C001",
            name: "SUO Piyush Kumar",
            enrollmentNo: "DEL/SD/24/4801",
            squadron: "hq",
            rank: "SUO",
            wing: "Army",
            year: 3,
            contact: "9876543210",
            email: "suo@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ001",
            bloodGroup: "O+",
            dob: "2004-01-01",
            approved: true
        });
        await suoCadet.save();

        const csmCadet = new Cadet({
            cadetId: "C002",
            name: "CSM Akshat Tiwari",
            enrollmentNo: "DEL/SD/24/4802",
            squadron: "hq",
            rank: "CSM",
            wing: "Army",
            year: 3,
            contact: "9876543211",
            email: "csm@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ002",
            bloodGroup: "A+",
            dob: "2004-02-02",
            approved: true
        });
        await csmCadet.save();

        const cqmsCadet = new Cadet({
            cadetId: "C003",
            name: "CQMS Ankit Singh",
            enrollmentNo: "DEL/SD/24/4803",
            squadron: "hq",
            rank: "CQMS",
            wing: "Army",
            year: 3,
            contact: "9876543212",
            email: "cqms@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ003",
            bloodGroup: "B+",
            dob: "2004-03-03",
            approved: true
        });
        await cqmsCadet.save();

        const juoCadet = new Cadet({
            cadetId: "C004",
            name: "JUO Ankit Kumar",
            enrollmentNo: "DEL/SD/24/4804",
            squadron: "hq",
            rank: "JUO",
            wing: "Army",
            year: 3,
            contact: "9876543213",
            email: "juo@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024HQ004",
            bloodGroup: "AB+",
            dob: "2004-04-04",
            approved: true
        });
        await juoCadet.save();

        // 2. Seed User Accounts linked to Cadet Profiles
        const adminUser = new User({
            email: 'admin@dtuncc.in',
            password: 'admin123',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user seeded (admin@dtuncc.in / admin123).');

        const anoUser = new User({
            email: 'ano@dtuncc.in',
            password: 'ano123',
            role: 'ano'
        });
        await anoUser.save();
        console.log('ANO user seeded (ano@dtuncc.in / ano123).');

        const suoUser = new User({
            email: 'suo@dtuncc.in',
            password: 'suo123',
            role: 'suo',
            cadetId: suoCadet._id
        });
        await suoUser.save();
        console.log('SUO user seeded (suo@dtuncc.in / suo123).');

        const csmUser = new User({
            email: 'csm@dtuncc.in',
            password: 'csm123',
            role: 'csm',
            cadetId: csmCadet._id
        });
        await csmUser.save();
        console.log('CSM user seeded (csm@dtuncc.in / csm123).');

        const cqmsUser = new User({
            email: 'cqms@dtuncc.in',
            password: 'cqms123',
            role: 'cqms',
            cadetId: cqmsCadet._id
        });
        await cqmsUser.save();
        console.log('CQMS user seeded (cqms@dtuncc.in / cqms123).');

        const juoUser = new User({
            email: 'juo@dtuncc.in',
            password: 'juo123',
            role: 'juo',
            cadetId: juoCadet._id
        });
        await juoUser.save();
        console.log('JUO user seeded (juo@dtuncc.in / juo123).');

        const cadetCadet = new Cadet({
            cadetId: "C005",
            name: "Cdt Rohit Sharma",
            enrollmentNo: "DEL/SD/24/4805",
            squadron: "alpha",
            rank: "Cadet",
            wing: "Army",
            year: 1,
            contact: "9876543214",
            email: "cadet@dtuncc.in",
            college: "DTU",
            dliNo: "DL2024AL005",
            bloodGroup: "O-",
            dob: "2005-05-05",
            approved: true
        });
        await cadetCadet.save();

        const cadetUser = new User({
            email: 'cadet@dtuncc.in',
            password: 'cadet123',
            role: 'cadet',
            cadetId: cadetCadet._id
        });
        await cadetUser.save();
        console.log('Cadet user seeded (cadet@dtuncc.in / cadet123).');

        // Seed Squadrons with 0 base points
        const squadronsToSeed = [
            { squadronId: 'alpha', name: 'Alpha Squadron', basePoints: 0 },
            { squadronId: 'bravo', name: 'Bravo Squadron', basePoints: 0 },
            { squadronId: 'charlie', name: 'Charlie Squadron', basePoints: 0 },
            { squadronId: 'delta', name: 'Delta Squadron', basePoints: 0 }
        ];
        await Squadron.insertMany(squadronsToSeed);
        console.log('Squadrons seeded with 0 base points.');

        // Seed Default Camps
        const defaultCamps = [
            {
                title: "Republic Day Camp (RDC)",
                category: "National Level",
                location: "New Delhi",
                duration: "Annual (January)",
                description: "The pinnacle camp held at Cariappa Parade Ground, Delhi Cantonment. Cadets are selected to represent the Delhi Directorate in guard of honour and PM rally.",
                date: "Jan"
            },
            {
                title: "Thal Sainik Camp (TSC)",
                category: "Adventure",
                location: "DG NCC Delhi",
                duration: "Sept-Oct",
                description: "Specialized military camp focusing on obstacle clearance courses, map reading, and rifle shooting.",
                date: "Sept-Oct"
            },
            {
                title: "Combined Annual Training Camp (CATC)",
                category: "Annual Compulsory",
                location: "Local Battalion Ground",
                duration: "10 Days",
                description: "Mandatory 10-day camp required for eligibility for NCC B & C Certificate exams.",
                date: "Variable Dates"
            }
        ];
        await Camp.insertMany(defaultCamps);
        console.log('Default camps seeded.');

        console.log('Database Seeding Completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedDB();
