import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';

function AppContent() {
    const { user, cadet, loading, login, logout } = useContext(AuthContext);
    const [currentTab, setCurrentTab] = useState('home');

    // Shared State from APIs
    const [leaderboard, setLeaderboard] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [cadets, setCadets] = useState([]);
    const [exemptions, setExemptions] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [fines, setFines] = useState([]);
    const [selectedViewCadet, setSelectedViewCadet] = useState(null);
    const [squadronFilter, setSquadronFilter] = useState('all');
    const [showSquadronGroupTables, setShowSquadronGroupTables] = useState(false);

    // Settings Form State
    const [settingsEmail, setSettingsEmail] = useState('');
    const [settingsPassword, setSettingsPassword] = useState('');
    const [settingsCurrentPassword, setSettingsCurrentPassword] = useState('');
    const [settingsMsg, setSettingsMsg] = useState('');
    const [settingsError, setSettingsError] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Leave Application Form State
    const [leaveDate, setLeaveDate] = useState('2026-07-07');
    const [leaveReason, setLeaveReason] = useState('Medical Emergency Leave');
    const [leaveMsg, setLeaveMsg] = useState('');

    // Self-Registration Form State
    const [regName, setRegName] = useState('');
    const [regEnrollment, setRegEnrollment] = useState('');
    const [regSquadron, setRegSquadron] = useState('alpha');
    const [regRank, setRegRank] = useState('Cadet');
    const [regYear, setRegYear] = useState('1');
    const [regContact, setRegContact] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // Extended Registration Fields
    const [regCollege, setRegCollege] = useState('DTU');
    const [regDliNo, setRegDliNo] = useState('');
    const [regBloodGroup, setRegBloodGroup] = useState('O+');
    const [regCourse, setRegCourse] = useState('Btech');
    const [regBranch, setRegBranch] = useState('');
    const [regCollegeRollNo, setRegCollegeRollNo] = useState('');
    const [regAcademicYear, setRegAcademicYear] = useState('1');
    const [regAltContact, setRegAltContact] = useState('');
    const [regAddress, setRegAddress] = useState('');
    const [regResidenceType, setRegResidenceType] = useState('Hostel');
    const [regHostelNo, setRegHostelNo] = useState('');
    const [regPgLocation, setRegPgLocation] = useState('');
    const [regCity, setRegCity] = useState('');
    const [regPincode, setRegPincode] = useState('');
    const [regFatherName, setRegFatherName] = useState('');
    const [regMotherName, setRegMotherName] = useState('');
    const [regGuardianName, setRegGuardianName] = useState('');
    const [regAllergies, setRegAllergies] = useState('');
    const [regMedicalConditions, setRegMedicalConditions] = useState('');
    const [regMedications, setRegMedications] = useState('');
    const [regCampsAttended, setRegCampsAttended] = useState('');
    const [regOtherDetails, setRegOtherDetails] = useState('');

    // OTP states
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtpVerified, setEmailOtpVerified] = useState(false);
    const [emailOtpInput, setEmailOtpInput] = useState('');
    const [emailSentOtpCode, setEmailSentOtpCode] = useState('');
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
    const [phoneOtpInput, setPhoneOtpInput] = useState('');
    const [phoneSentOtpCode, setPhoneSentOtpCode] = useState('');

    // Forgot ID / Password State
    const [forgotMode, setForgotMode] = useState('menu'); // 'menu', 'id', 'password'
    const [forgotDliNo, setForgotDliNo] = useState('');
    const [forgotContact, setForgotContact] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtpSent, setForgotOtpSent] = useState(false);
    const [forgotOtpInput, setForgotOtpInput] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');
    const [forgotError, setForgotError] = useState('');
    
    // DOB States (Phase 2)
    const [regDob, setRegDob] = useState('');
    const [forgotName, setForgotName] = useState('');
    const [forgotDob, setForgotDob] = useState('');

    // Notice Board & Camp States
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeBody, setNoticeBody] = useState('');
    const [noticeMsg, setNoticeMsg] = useState('');

    const [campTitle, setCampTitle] = useState('');
    const [campCategory, setCampCategory] = useState('National Level');
    const [campLocation, setCampLocation] = useState('');
    const [campDuration, setCampDuration] = useState('');
    const [campDescription, setCampDescription] = useState('');
    const [campDate, setCampDate] = useState('');
    const [campMsg, setCampMsg] = useState('');
    
    // Dynamic Camps List
    const [campsList, setCampsList] = useState([]);

    const [regMsg, setRegMsg] = useState('');
    const [regErrorMsg, setRegErrorMsg] = useState('');

    const getRoleDisplayName = (role) => {
        if (role === 'admin') return 'Unit Administrator';
        if (role === 'ano') return 'Associate NCC Officer (ANO)';
        if (role === 'suo') return 'Senior Under Officer (SUO)';
        if (role === 'csm') return 'Company Sergeant Major (CSM)';
        if (role === 'cqms') return 'Company Quartermaster Sergeant (CQMS)';
        if (role === 'juo') return 'Junior Under Officer (JUO)';
        return 'Cadet';
    };

    // Admin Forms State
    const [editingCadetId, setEditingCadetId] = useState(null);
    const [cadetName, setCadetName] = useState('');
    const [cadetEnrollment, setCadetEnrollment] = useState('');
    const [cadetSquadron, setCadetSquadron] = useState('alpha');
    const [cadetRank, setCadetRank] = useState('Cdt');
    const [cadetWing, setCadetWing] = useState('Army');
    const [cadetYear, setCadetYear] = useState('2');
    const [cadetContact, setCadetContact] = useState('');
    const [cadetEmail, setCadetEmail] = useState('');
    const [cadetDob, setCadetDob] = useState('');
    const [cadetResidenceType, setCadetResidenceType] = useState('Hostel');
    const [cadetHostelNo, setCadetHostelNo] = useState('');
    const [cadetPgLocation, setCadetPgLocation] = useState('');
    const [adminCadetMsg, setAdminCadetMsg] = useState('');

    // Simulator Forms State
    const [simCadetId, setSimCadetId] = useState('');
    const [simDate, setSimDate] = useState('2026-07-07');
    const [simStatus, setSimStatus] = useState('Present');
    const [simMsg, setSimMsg] = useState('');

    // Placements Form State
    const [simCompId, setSimCompId] = useState('cross-country');
    const [simCompName, setSimCompName] = useState('Cross-Country');
    const [simCompType, setSimCompType] = useState('Major');
    const [simCompSquadron, setSimCompSquadron] = useState('alpha');
    const [simCompPosition, setSimCompPosition] = useState('1');
    const [simCompMsg, setSimCompMsg] = useState('');

    // CSM Turnout State
    const [simTurnoutSquadron, setSimTurnoutSquadron] = useState('alpha');
    const [simTurnoutDeduction, setSimTurnoutDeduction] = useState('0.5');
    const [simTurnoutDate, setSimTurnoutDate] = useState('2026-07-07');
    const [simTurnoutMsg, setSimTurnoutMsg] = useState('');

    // SUO Contribution State
    const [simContributionSquadron, setSimContributionSquadron] = useState('alpha');
    const [simContributionDeduction, setSimContributionDeduction] = useState('0.5');
    const [simContributionDate, setSimContributionDate] = useState('2026-07-07');
    const [simContributionMsg, setSimContributionMsg] = useState('');

    // Collapsed Squadron Breakdown in Leaderboard
    const [collapsedSq, setCollapsedSq] = useState({});

    // Fetch Public Data
    const fetchPublicData = async () => {
        try {
            const lbRes = await fetch('/api/leaderboard');
            if (lbRes.ok) setLeaderboard(await lbRes.json());

            const annRes = await fetch('/api/announcements');
            if (annRes.ok) setAnnouncements(await annRes.json());

            const campRes = await fetch('/api/camps');
            if (campRes.ok) setCampsList(await campRes.json());
        } catch (err) {
            console.error('Error fetching public data:', err);
        }
    };

    // Fetch Admin Data
    const fetchAdminData = async () => {
        if (!user || user.role !== 'admin') return;
        try {
            const cadRes = await fetch('/api/cadets');
            if (cadRes.ok) {
                const data = await cadRes.json();
                setCadets(data);
                if (data.length > 0 && !simCadetId) setSimCadetId(data[0].cadetId);
            }

            const exRes = await fetch('/api/exemptions');
            if (exRes.ok) setExemptions(await exRes.json());

            const attRes = await fetch('/api/attendance');
            if (attRes.ok) setAttendance(await attRes.json());

            const fineRes = await fetch('/api/fines');
            if (fineRes.ok) setFines(await fineRes.json());
        } catch (err) {
            console.error('Error fetching admin data:', err);
        }
    };

    // Fetch Cadet Data
    const fetchCadetData = async () => {
        if (!user || user.role !== 'cadet' || !cadet) return;
        try {
            const attRes = await fetch('/api/attendance');
            if (attRes.ok) {
                const allAtt = await attRes.json();
                setAttendance(allAtt.filter(a => a.cadetId === cadet.cadetId));
            }

            const fineRes = await fetch('/api/fines');
            if (fineRes.ok) {
                const allFines = await fineRes.json();
                setFines(allFines.filter(f => f.cadetId === cadet.cadetId));
            }

            const exRes = await fetch('/api/exemptions');
            if (exRes.ok) {
                const allEx = await exRes.json();
                setExemptions(allEx.filter(e => e.cadetId === cadet.cadetId));
            }
        } catch (err) {
            console.error('Error fetching cadet data:', err);
        }
    };

    useEffect(() => {
        fetchPublicData();
    }, []);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                fetchAdminData();
            } else {
                fetchCadetData();
            }
        }
    }, [user, cadet]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        const res = await login(loginEmail, loginPassword);
        if (res.success) {
            setLoginEmail('');
            setLoginPassword('');
            setCurrentTab('dashboard');
        } else {
            setLoginError(res.message);
        }
    };

    const handleSendEmailOtp = async () => {
        if (!regEmail) {
            alert('Please enter your Mail ID first.');
            return;
        }
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: regEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setEmailOtpSent(true);
                setEmailSentOtpCode(data.otp);
                if (data.otp) {
                    alert(`[Mock Mode] Email OTP Sent! Copy Code: ${data.otp}`);
                } else {
                    alert(`Verification OTP has been sent to your email address: ${regEmail}. Please check your inbox.`);
                }
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            alert('Error sending OTP');
        }
    };

    const handleVerifyEmailOtp = async () => {
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: regEmail, otp: emailOtpInput })
            });
            const data = await res.json();
            if (res.ok) {
                setEmailOtpVerified(true);
                alert('Email verified successfully!');
            } else {
                alert(data.message || 'Verification failed');
            }
        } catch (err) {
            alert('Error verifying OTP');
        }
    };

    const handleSendPhoneOtp = async () => {
        const phoneRegex = /^\d{10}$/;
        if (!regContact || !phoneRegex.test(regContact)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: regContact })
            });
            const data = await res.json();
            if (res.ok) {
                setPhoneOtpSent(true);
                setPhoneSentOtpCode(data.otp);
                alert(`Simulated Mobile OTP Sent! Copy Code: ${data.otp}`);
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            alert('Error sending OTP');
        }
    };

    const handleVerifyPhoneOtp = async () => {
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: regContact, otp: phoneOtpInput })
            });
            const data = await res.json();
            if (res.ok) {
                setPhoneOtpVerified(true);
                alert('Mobile number verified successfully!');
            } else {
                alert(data.message || 'Verification failed');
            }
        } catch (err) {
            alert('Error verifying OTP');
        }
    };

    const handleRecoverAccountVerify = async (e) => {
        e.preventDefault();
        setForgotMsg('');
        setForgotError('');

        if (!forgotName || !forgotDob || !forgotContact) {
            setForgotError('Name, Date of Birth, and mobile number are required.');
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(forgotContact)) {
            setForgotError('Please enter a valid 10-digit mobile number.');
            return;
        }

        try {
            const res = await fetch('/api/auth/recover-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: forgotName, dob: forgotDob, contact: forgotContact })
            });

            const data = await res.json();
            if (res.ok) {
                setForgotEmail(data.email);
                setForgotOtpSent(true);
                setForgotMsg(data.message);
                if (data.otp) {
                    alert(`[Mock Mode] Account recovery OTP Sent! Copy Code: ${data.otp}`);
                }
            } else {
                setForgotError(data.message || 'Verification failed. Please check your details.');
            }
        } catch (err) {
            setForgotError('Error communicating with the server.');
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setForgotMsg('');
        setForgotError('');

        if (!forgotEmail || !forgotOtpInput || !forgotNewPassword || !forgotConfirmPassword) {
            setForgotError('All fields are required.');
            return;
        }

        if (forgotNewPassword !== forgotConfirmPassword) {
            setForgotError('Passwords do not match.');
            return;
        }

        if (forgotNewPassword.length < 6) {
            setForgotError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: forgotEmail,
                    otp: forgotOtpInput,
                    newPassword: forgotNewPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Password reset successfully! You can now login with your new password.');
                // Reset states and go back to login
                setForgotMode('menu');
                setForgotEmail('');
                setForgotOtpSent(false);
                setForgotOtpInput('');
                setForgotNewPassword('');
                setForgotConfirmPassword('');
                setCurrentTab('login');
            } else {
                setForgotError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            setForgotError('Error communicating with the server.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegMsg('');
        setRegErrorMsg('');

        if (!emailOtpVerified) {
            setRegErrorMsg('Please verify your Mail ID with OTP.');
            return;
        }
        if (!phoneOtpVerified) {
            setRegErrorMsg('Please verify your Mobile Number with OTP.');
            return;
        }
        const phoneRegex = /^\d{10}$/;
        if (!regContact || !phoneRegex.test(regContact)) {
            setRegErrorMsg('Mobile number must be exactly 10 digits.');
            return;
        }
        if (!regDliNo || (!regDliNo.startsWith('DL2024') && !regDliNo.startsWith('DL2025'))) {
            setRegErrorMsg('DLI Number must begin with either DL2024 or DL2025.');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: regName,
                    enrollmentNo: regDliNo,
                    squadron: regSquadron,
                    rank: regRank,
                    wing: 'Army',
                    year: parseInt(regYear),
                    contact: regContact,
                    email: regEmail,
                    password: regPassword,
                    dob: regDob,
                    college: regCollege,
                    dliNo: regDliNo,
                    bloodGroup: regBloodGroup,
                    course: regCourse,
                    branch: regBranch,
                    collegeRollNo: regCollegeRollNo,
                    academicYear: regAcademicYear,
                    altContact: regAltContact,
                    address: regAddress,
                    residenceType: regResidenceType,
                    hostelNo: regResidenceType === 'Hostel' ? regHostelNo : '',
                    pgLocation: regResidenceType === 'PG/Flat' ? regPgLocation : '',
                    city: regCity,
                    pincode: regPincode,
                    fatherName: regFatherName,
                    motherName: regMotherName,
                    guardianName: regGuardianName,
                    allergies: regAllergies,
                    medicalConditions: regMedicalConditions,
                    medications: regMedications,
                    campsAttended: regCampsAttended,
                    otherDetails: regOtherDetails
                })
            });
            const data = await res.json();
            if (res.ok) {
                setRegMsg(`Registration successful! Your application is pending review by the Admin/ANO.`);
                setRegName('');
                setRegEnrollment('');
                setRegContact('');
                setRegEmail('');
                setRegPassword('');
                setRegDliNo('');
                setRegBranch('');
                setRegCollegeRollNo('');
                setRegAltContact('');
                setRegAltContact('');
                setRegAddress('');
                setRegHostelNo('');
                setRegPgLocation('');
                setRegCity('');
                setRegPincode('');
                setRegFatherName('');
                setRegMotherName('');
                setRegGuardianName('');
                setRegAllergies('');
                setRegMedicalConditions('');
                setRegMedications('');
                setRegCampsAttended('');
                setRegOtherDetails('');
                setEmailOtpSent(false);
                setEmailOtpVerified(false);
                setEmailOtpInput('');
                setPhoneOtpSent(false);
                setPhoneOtpVerified(false);
                setPhoneOtpInput('');
            } else {
                setRegErrorMsg(data.message || 'Registration failed');
            }
        } catch (err) {
            setRegErrorMsg('Error contacting backend server.');
        }
    };

    const handleNoticeSubmit = async (e) => {
        e.preventDefault();
        setNoticeMsg('');
        if (!noticeTitle || !noticeBody) return;

        try {
            const author = cadet ? `${cadet.rank} ${cadet.name}` : (user.role === 'admin' ? 'Unit Administrator' : user.role.toUpperCase());
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: noticeTitle,
                    body: noticeBody,
                    postedBy: author,
                    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                })
            });
            const data = await res.json();
            if (res.ok) {
                setNoticeMsg('Notice posted successfully to Home Board!');
                setNoticeTitle('');
                setNoticeBody('');
                // reload notices
                const annRes = await fetch('/api/announcements');
                if (annRes.ok) setAnnouncements(await annRes.json());
            } else {
                alert(data.message || 'Failed to post notice');
            }
        } catch (err) {
            console.error('Error posting notice:', err);
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        try {
            const res = await fetch(`/api/announcements/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('Notice deleted successfully.');
                // reload notices
                const annRes = await fetch('/api/announcements');
                if (annRes.ok) setAnnouncements(await annRes.json());
            } else {
                alert('Failed to delete notice.');
            }
        } catch (err) {
            console.error('Error deleting notice:', err);
        }
    };

    const handleCampSubmit = async (e) => {
        e.preventDefault();
        setCampMsg('');
        if (!campTitle || !campCategory || !campLocation) return;

        try {
            const res = await fetch('/api/camps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: campTitle,
                    category: campCategory,
                    location: campLocation,
                    duration: campDuration,
                    description: campDescription,
                    date: campDate
                })
            });
            const data = await res.json();
            if (res.ok) {
                setCampMsg('Camp added successfully to Camps Directory!');
                setCampTitle('');
                setCampLocation('');
                setCampDuration('');
                setCampDescription('');
                setCampDate('');
                // reload camps list
                const campRes = await fetch('/api/camps');
                if (campRes.ok) setCampsList(await campRes.json());
            } else {
                alert(data.message || 'Failed to add camp');
            }
        } catch (err) {
            console.error('Error adding camp:', err);
        }
    };

    const handleLeaveRequest = async (e) => {
        e.preventDefault();
        setLeaveMsg('');
        if (!cadet) return;

        try {
            const res = await fetch('/api/exemptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cadetId: cadet.cadetId,
                    date: leaveDate,
                    reason: leaveReason
                })
            });
            const data = await res.json();
            if (res.ok) {
                setLeaveMsg('Exemption leave request submitted successfully!');
                fetchCadetData();
            } else {
                setLeaveMsg(data.message || 'Submission failed');
            }
        } catch (err) {
            setLeaveMsg('Error contacting backend server.');
        }
    };

    // Exemption Approval
    const handleExemptionDecision = async (id, status) => {
        try {
            const res = await fetch(`/api/exemptions/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchAdminData();
                fetchPublicData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Cadet CRUD Add/Edit
    const handleCadetSubmit = async (e) => {
        e.preventDefault();
        setAdminCadetMsg('');
        const payload = {
            name: cadetName,
            enrollmentNo: cadetEnrollment,
            squadron: cadetSquadron,
            rank: cadetRank,
            wing: cadetWing,
            year: parseInt(cadetYear),
            contact: cadetContact,
            email: cadetEmail,
            dob: cadetDob,
            residenceType: cadetResidenceType,
            hostelNo: cadetResidenceType === 'Hostel' ? cadetHostelNo : '',
            pgLocation: cadetResidenceType === 'PG/Flat' ? cadetPgLocation : ''
        };

        try {
            let res;
            if (editingCadetId) {
                res = await fetch(`/api/cadets/${editingCadetId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/cadets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();
            if (res.ok) {
                setAdminCadetMsg(editingCadetId ? 'Cadet record updated successfully!' : `Successfully enrolled cadet ${cadetName}!`);
                setEditingCadetId(null);
                setCadetName('');
                setCadetEnrollment('');
                setCadetContact('');
                setCadetEmail('');
                setCadetDob('');
                setCadetResidenceType('Hostel');
                setCadetHostelNo('');
                setCadetPgLocation('');
                fetchAdminData();
            } else {
                setAdminCadetMsg(data.message || 'Operation failed.');
            }
        } catch (err) {
            setAdminCadetMsg('Error saving cadet details.');
        }
    };

    const handleEditClick = (c) => {
        setEditingCadetId(c._id);
        setCadetName(c.name);
        setCadetEnrollment(c.enrollmentNo);
        setCadetSquadron(c.squadron);
        setCadetRank(c.rank);
        setCadetWing(c.wing);
        setCadetYear(String(c.year));
        setCadetContact(c.contact);
        setCadetEmail(c.email);
        setCadetDob(c.dob || '');
        setCadetResidenceType(c.residenceType || 'Hostel');
        setCadetHostelNo(c.hostelNo || '');
        setCadetPgLocation(c.pgLocation || '');
        document.getElementById('cadet-form-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (!confirm('Are you sure you want to delete this cadet?')) return;
        try {
            const res = await fetch(`/api/cadets/${id}`, { method: 'DELETE' });
            if (res.ok) fetchAdminData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleApproveCadet = async (id) => {
        try {
            const res = await fetch(`/api/cadets/approve/${id}`, {
                method: 'PUT'
            });
            const data = await res.json();
            if (res.ok) {
                alert('Cadet registration approved successfully!');
                fetchAdminData();
            } else {
                alert(data.message || 'Failed to approve cadet');
            }
        } catch (err) {
            console.error('Error approving cadet:', err);
        }
    };

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        setSettingsMsg('');
        setSettingsError('');

        if (!settingsCurrentPassword) {
            setSettingsError('Current password is required to verify identity.');
            return;
        }

        try {
            const res = await fetch('/api/auth/update-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    email: settingsEmail,
                    newPassword: settingsPassword,
                    currentPassword: settingsCurrentPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSettingsMsg('Account updated successfully!');
                setSettingsEmail('');
                setSettingsPassword('');
                setSettingsCurrentPassword('');
            } else {
                setSettingsError(data.message || 'Failed to update account');
            }
        } catch (err) {
            console.error('Error updating account:', err);
            setSettingsError('Error contacting backend server.');
        }
    };

    // Attendance Sync Simulator
    const handleAttendanceSim = async (e) => {
        e.preventDefault();
        setSimMsg('');

        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: simDate,
                    cadetId: simCadetId,
                    status: simStatus,
                    markedBy: 'ANO/CQMS (Simulated)'
                })
            });
            if (res.ok) {
                setSimMsg(`Attendance synced for ${simCadetId} on ${simDate}`);
                fetchAdminData();
                fetchPublicData();
            } else {
                const data = await res.json();
                setSimMsg(data.message || 'Marking attendance failed.');
            }
        } catch (err) {
            setSimMsg('Error.');
        }
    };

    // Placements Form Submit
    const handleCompetitionSubmit = async (e) => {
        e.preventDefault();
        setSimCompMsg('');

        try {
            const res = await fetch('/api/leaderboard/competition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    compId: simCompId,
                    compName: simCompName,
                    compType: simCompType,
                    squadronId: simCompSquadron,
                    position: parseInt(simCompPosition),
                    dateRecorded: new Date().toISOString().split('T')[0]
                })
            });
            if (res.ok) {
                setSimCompMsg(`Recorded position #${simCompPosition} for ${simCompSquadron.toUpperCase()}`);
                fetchPublicData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Turnout Submit
    const handleTurnoutSubmit = async (e) => {
        e.preventDefault();
        setSimTurnoutMsg('');
        try {
            const res = await fetch('/api/leaderboard/turnout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    squadronId: simTurnoutSquadron,
                    points: parseFloat(simTurnoutDeduction),
                    date: simTurnoutDate
                })
            });
            if (res.ok) {
                setSimTurnoutMsg('Applied Turnout penalty.');
                fetchPublicData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Contribution Submit
    const handleContributionSubmit = async (e) => {
        e.preventDefault();
        setSimContributionMsg('');
        try {
            const res = await fetch('/api/leaderboard/contribution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    squadronId: simContributionSquadron,
                    points: parseFloat(simContributionDeduction),
                    date: simContributionDate
                })
            });
            if (res.ok) {
                setSimContributionMsg('Applied SUO Contribution penalty.');
                fetchPublicData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // pay fine API trigger
    const handlePayFine = async (fineId) => {
        try {
            const res = await fetch(`/api/fines/${fineId}/pay`, { method: 'PUT' });
            if (res.ok) {
                if (user.role === 'admin') fetchAdminData();
                else fetchCadetData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const SquadronTable = ({ squadronId, borderTheme }) => {
        // Exclude command board from squadron lists to prevent duplication
        const sqCadets = cadets
            .filter(c => c.approved)
            .filter(c => c.squadron === squadronId)
            .filter(c => !['SUO', 'CSM', 'CQMS', 'ANO'].includes(c.rank));

        return (
            <div style={{ overflowX: 'auto' }}>
                <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.82rem' }}>
                    <thead>
                        <tr style={{ borderBottom: `2px solid ${borderTheme}` }}>
                            <th>Rank & Name (Click for Profile)</th>
                            <th>Cadet ID</th>
                            <th>DLI / Regt No</th>
                            <th>Year</th>
                            <th>Contact</th>
                            <th>Blood Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sqCadets.map(c => (
                            <tr key={c._id}>
                                <td>
                                    <button 
                                        onClick={() => setSelectedViewCadet(c)}
                                        style={{ background: 'none', border: 'none', color: borderTheme, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                        title="View full cadet profile details"
                                    >
                                        {c.rank} {c.name}
                                    </button>
                                </td>
                                <td>{c.cadetId}</td>
                                <td>{c.enrollmentNo || c.dliNo}</td>
                                <td>Year {c.year}</td>
                                <td>{c.contact}</td>
                                <td><span style={{ color: 'var(--danger)', fontWeight: '700' }}>{c.bloodGroup || 'N/A'}</span></td>
                            </tr>
                        ))}
                        {sqCadets.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center" style={{ color: 'var(--text-muted)', padding: '15px 0' }}>No registered cadets in this squadron.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    // Database Reset
    const handleResetDatabase = async () => {
        if (!confirm('Are you sure you want to reset the database? All cadets and custom scores will be deleted.')) return;
        try {
            const res = await fetch('/api/auth/reset', { method: 'POST' });
            if (res.ok) {
                logout();
                setCurrentTab('home');
                fetchPublicData();
                alert('Database successfully reset to defaults.');
            }
        } catch (err) {
            alert('Reset failed.');
        }
    };

    const toggleBreakdown = (sqId) => {
        setCollapsedSq(prev => ({
            ...prev,
            [sqId]: !prev[sqId]
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header / Brand Nav */}
            {/* Header / Brand Nav */}
            <header className="app-header">
                <div className="logo-container" onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="dtu_ncc_logo_transparent.png" alt="DTU NCC Logo" className="logo-img" style={{ height: '45px', width: 'auto' }} />
                    <div className="logo-text">
                        <h1>1 DBN NCC</h1>
                        <p>Delhi Technological University</p>
                    </div>
                </div>
                
                <nav className="main-nav">
                    <button 
                        className="menu-toggle" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        aria-label="Toggle menu" 
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--navy-blue)', padding: '5px', display: 'none' }}
                    >
                        <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
                    </button>
                    
                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li><a href="#" className={`nav-link ${currentTab === 'home' ? 'active' : ''}`} onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}>Home</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'about' ? 'active' : ''}`} onClick={() => { setCurrentTab('about'); setMobileMenuOpen(false); }}>About Us</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'camps' ? 'active' : ''}`} onClick={() => { setCurrentTab('camps'); setMobileMenuOpen(false); }}>Camps</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'leaderboard' ? 'active' : ''}`} onClick={() => { setCurrentTab('leaderboard'); setMobileMenuOpen(false); }}>Leaderboard</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'rankpanel' ? 'active' : ''}`} onClick={() => { setCurrentTab('rankpanel'); setMobileMenuOpen(false); }}>Rank Panel</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'contact' ? 'active' : ''}`} onClick={() => { setCurrentTab('contact'); setMobileMenuOpen(false); }}>Notices & Help</a></li>
                        
                        {!user && (
                            <li><a href="#" className={`nav-link ${currentTab === 'register' ? 'active' : ''}`} onClick={() => { setCurrentTab('register'); setMobileMenuOpen(false); }}>Cadet Registration</a></li>
                        )}
                        
                        {user && (
                            <li>
                                <a 
                                    href="#" 
                                    className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`} 
                                    onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
                                >
                                    {['admin', 'ano', 'suo', 'cqms', 'csm', 'juo'].includes(user.role) ? 'Admin Portal' : 'My Dashboard'}
                                </a>
                            </li>
                        )}
                        {user && (
                            <li>
                                <a 
                                    href="#" 
                                    className={`nav-link ${currentTab === 'settings' ? 'active' : ''}`} 
                                    onClick={() => {
                                        setSettingsMsg('');
                                        setSettingsError('');
                                        setCurrentTab('settings');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <i className="fa-solid fa-user-gear"></i> Settings
                                </a>
                            </li>
                        )}
                        
                        <li>
                            {user ? (
                                <button className="btn btn-outline" onClick={() => { logout(); setCurrentTab('home'); setMobileMenuOpen(false); }} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout ({user.role === 'admin' ? 'Admin' : user.role === 'ano' ? 'ANO' : user.role === 'suo' ? 'SUO' : user.role === 'csm' ? 'CSM' : user.role === 'cqms' ? 'CQMS' : user.role === 'juo' ? 'JUO' : (cadet?.name || 'Cadet')})
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={() => { setLoginError(''); setCurrentTab('login'); setMobileMenuOpen(false); }} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    <i className="fa-solid fa-right-to-bracket"></i> Cadet Login
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main view routing render area */}
            <main className="main-content">
                {/* 1. Home View */}
                {currentTab === 'home' && (
                    <div className="view-section active">
                        <div className="hero-section">
                            <div className="hero-content">
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '25px', width: '100%' }}>
                                    <img src="dtu_ncc_logo_transparent.png" alt="DTU NCC Logo" style={{ height: '220px', width: 'auto', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
                                    <img src="ncc_logo_transparent.png" alt="NCC Logo" style={{ height: '220px', width: 'auto', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }} />
                                </div>
                                <div className="hero-tagline">1 Delhi Battalion (1 DBN) NCC Unit</div>
                                <h1 className="hero-title">DTU Cadet Portal</h1>
                                <p className="hero-desc">Building character, comradeship, discipline, a secular outlook, the spirit of adventure, and ideals of selfless service among the youth of the Delhi Technological University detachment.</p>
                                <div className="hero-buttons">
                                    <button className="btn btn-primary" onClick={() => setCurrentTab('camps')}><i className="fa-solid fa-tent"></i> Explore Camps</button>
                                    <button className="btn btn-outline" onClick={() => setCurrentTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Championship Standings</button>
                                    {!user && (
                                        <>
                                            <button className="btn btn-outline" onClick={() => { setLoginError(''); setCurrentTab('login'); }} style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                                                <i className="fa-solid fa-right-to-bracket"></i> Cadet Login
                                            </button>
                                            <button className="btn btn-outline" onClick={() => setCurrentTab('register')} style={{ borderColor: 'var(--saffron)', color: 'var(--saffron)' }}>
                                                <i className="fa-solid fa-user-plus"></i> Cadet Registration
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="slogan-ticker-section">
                            <div className="slogan-ticker-wrapper">
                                <div className="slogan-ticker-item"><i className="fa-solid fa-star"></i> Unity and Discipline</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-shield-halved"></i> Service Before Self</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-flag"></i> Nation First, Always First</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-crosshairs"></i> Ekta aur Anushasan</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-user-shield"></i> Duty, Honor, Country</div>
                            </div>
                            <div className="slogan-ticker-wrapper" aria-hidden="true">
                                <div className="slogan-ticker-item"><i className="fa-solid fa-star"></i> Unity and Discipline</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-shield-halved"></i> Service Before Self</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-flag"></i> Nation First, Always First</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-crosshairs"></i> Ekta aur Anushasan</div>
                                <div className="slogan-ticker-item"><i className="fa-solid fa-user-shield"></i> Duty, Honor, Country</div>
                            </div>
                        </div>

                        <div className="container home-row">
                            <div className="motto-box">
                                <div className="motto-title">NCC Motto</div>
                                <div className="motto-text">"Unity and Discipline" (Ekta aur Anushasan)</div>
                            </div>

                            <div className="motto-box" style={{ borderLeft: '5px solid var(--primary)', borderRight: '5px solid var(--primary)', marginTop: '-25px', marginBottom: '45px' }}>
                                <div className="motto-title" style={{ fontSize: '1.4rem' }}>Aims of NCC</div>
                                <ul style={{ textAlign: 'left', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6', paddingLeft: '20px', listStyleType: 'square', display: 'inline-block', margin: '0 auto', maxWidth: '800px' }}>
                                    <li style={{ marginBottom: '8px' }}>To develop character, comradeship, discipline, leadership, secular outlook, spirit of adventure, and ideals of selfless service among the youth of the country.</li>
                                    <li style={{ marginBottom: '8px' }}>To create a human resource of organized, trained and motivated youth, to provide leadership in all walks of life and be always available for the service of the nation.</li>
                                    <li>To provide a suitable environment to motivate the youth to take up a career in the Armed Forces.</li>
                                </ul>
                            </div>

                            <div className="section-header">
                                <h2>1 DBN Army Wing Training</h2>
                                <p>DTU NCC operates exclusively under the Army Wing, specializing in infantry training divisions:</p>
                            </div>

                            <div className="card-grid">
                                <div className="card wing-card">
                                    <div className="wing-badge"><i className="fa-solid fa-person-rifle"></i></div>
                                    <h3>Drill & Weapon Training</h3>
                                    <p>Instruction in squad and platoon drill movements, commanding words, and assembly/firing of 0.22 Deluxe and INSAS rifles.</p>
                                </div>
                                <div className="card wing-card">
                                    <div className="wing-badge"><i className="fa-solid fa-compass"></i></div>
                                    <h3>Map Reading</h3>
                                    <p>Prismatic compass navigation, finding north, grid coordinates, grid bearings, contour lines, and finding own position in the field.</p>
                                </div>
                                <div className="card wing-card">
                                    <div className="wing-badge"><i className="fa-solid fa-shield-halved"></i></div>
                                    <h3>Field Craft & Battle Craft</h3>
                                    <p>Tactical field training including camouflage, concealment, judging distance, battle indications, and infantry squad patrol drills.</p>
                                </div>
                            </div>
                        </div>

                        <div className="container home-row">
                            <div className="section-header">
                                <h2>Commanding Leadership of NCC</h2>
                                <p>The distinguished officers heading the National Cadet Corps command chain</p>
                            </div>
                            
                            <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                                <div className="card officer-card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <img src="gallery/dg_virendra_vats.jpg" alt="Lt Gen Virendra Vats" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '15px' }} />
                                    <span className="badge badge-warning" style={{ backgroundColor: 'var(--saffron)', color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}>Director General (DG)</span>
                                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '1rem', fontWeight: '700' }}>Lt Gen Virendra Vats, SM, VSM</h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>DG NCC Headquarters, New Delhi</p>
                                </div>
                                
                                <div className="card officer-card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <img src="gallery/adg_avatar.png" alt="Maj Gen Ravinder Kumar Dabas" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '15px' }} />
                                    <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>Addl Director General (ADG)</span>
                                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '1rem', fontWeight: '700' }}>Maj Gen Ravinder Kumar Dabas, SM, VSM</h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>ADG Delhi Directorate</p>
                                </div>

                                <div className="card officer-card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <img src="gallery/ddg_avatar.jpg" alt="Brig PS Chonkar" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '15px' }} />
                                    <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>Group Commander</span>
                                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '1rem', fontWeight: '700' }}>Brig PS Chonkar</h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Group Commander, Delhi Group 'B'</p>
                                </div>

                                <div className="card officer-card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <img src="gallery/co_avatar.jpg" alt="Col Gurpreet Singh" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '15px' }} />
                                    <span className="badge" style={{ backgroundColor: 'var(--navy-blue)', color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}>Commanding Officer (CO)</span>
                                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '1rem', fontWeight: '700' }}>Col Gurpreet Singh</h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>CO 1 Delhi Battalion NCC</p>
                                </div>

                                <div className="card officer-card" style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-sm)', marginBottom: '15px', backgroundColor: '#f0f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)' }}>
                                        <i className="fa-solid fa-user-shield" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px' }}>Photo Awaiting</span>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}>Administrative Officer (AO)</span>
                                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '1rem', fontWeight: '700' }}>Lt Col NS Mann</h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>AO 1 Delhi Battalion NCC</p>
                                </div>
                            </div>
                        </div>

                        <div className="home-row alt">
                            <div className="container">
                                <div className="section-header">
                                    <h2>Latest Announcements</h2>
                                    <p>Keep up to date with the latest parade schedules and camp nominations</p>
                                </div>
                                <div className="notice-preview-grid">
                                    {announcements.slice(0, 2).map((n, i) => (
                                        <div className="announcement-item" key={i}>
                                            <div className="announcement-main">
                                                <div className="announcement-title">{n.title}</div>
                                                <div className="announcement-body">{n.body}</div>
                                            </div>
                                            <div className="announcement-meta">
                                                <span className="date"><i className="fa-regular fa-calendar"></i> {n.date}</span>
                                                <span className="author">By: {n.postedBy}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {announcements.length === 0 && (
                                        <p className="text-center" style={{ color: 'var(--text-muted)' }}>No notices posted in this session.</p>
                                    )}
                                </div>
                                <div className="text-center" style={{ marginTop: '30px' }}>
                                    <button className="btn btn-outline" onClick={() => setCurrentTab('contact')}>View Notice Board</button>
                                </div>
                            </div>
                        </div>



                        <div className="container home-row">
                            <div className="cta-banner">
                                <h3>Cadet Portal Access</h3>
                                <p>Are you an active DTU NCC cadet? Sign in to submit camp nominations, track your attendance logs, review fine statements, and check squadron rankings.</p>
                                <button className="btn btn-primary" onClick={() => { setLoginError(''); setCurrentTab('login'); }}><i className="fa-solid fa-right-to-bracket"></i> Go to Cadet Login</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. About Us View */}
                {currentTab === 'about' && (
                    <div className="view-section active">
                        <div className="container" style={{ paddingTop: '40px' }}>
                            <div className="section-header">
                                <h2>About DTU NCC Unit</h2>
                                <p>Developing disciplined citizens and leaders of tomorrow</p>
                            </div>
                            
                            <div className="about-intro-grid">
                                <div>
                                    <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text)', marginBottom: '15px' }}>
                                        The National Cadet Corps Unit at Delhi Technological University (DTU) is an active part of **1 Delhi Battalion (1 DBN) NCC**. The unit fosters leadership qualities, national cohesion, discipline, and a strong sense of service.
                                    </p>
                                    <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
                                        Through military drills, weapons education, firing ranges, physical endurance maps, and leadership camps, cadets are trained to handle challenging environments. The Unit serves as a gateway for cadets aspiring to serve in the Indian Armed Forces.
                                    </p>
                                </div>
                                <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>"Duty, Honor, Discipline"</h4>
                                    <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>We operate our inter-squadron championships and training schedules under the direct command of the Associate NCC Officer (ANO) and Senior cadet ranks.</p>
                                </div>
                            </div>

                            <div className="timeline-section" style={{ marginTop: '50px' }}>
                                <h3 className="text-center" style={{ marginBottom: '30px' }}>Training & Camp Milestones</h3>
                                <div className="timeline">
                                    <div className="timeline-container left">
                                        <div className="timeline-content">
                                            <h4>Enrollment & Selection</h4>
                                            <p>Rigorous physical selection, running, and interviews are conducted in August for the incoming batch.</p>
                                        </div>
                                    </div>
                                    <div className="timeline-container right">
                                        <div className="timeline-content">
                                            <h4>Weekly Parades & Weaponry</h4>
                                            <p>Parades are held every Saturday focusing on squad drill movements, weapon handling (INSAS/0.22 Delux), and military theory.</p>
                                        </div>
                                    </div>
                                    <div className="timeline-container left">
                                        <div className="timeline-content">
                                            <h4>Annual CATC/ATC Camps</h4>
                                            <p>Cadets participate in 10-day military camps focusing on obstacle training, night patrolling, firing matches, and military discipline.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Camps View */}
                {currentTab === 'camps' && (
                    <div className="view-section active">
                        <div className="container" style={{ paddingTop: '40px' }}>
                            <div className="section-header">
                                <h2>NCC Camps Directory</h2>
                                <p>Apply for national, regional, and annual combined training camps</p>
                            </div>

                            <div className="camps-grid">
                                {campsList.map((c, idx) => (
                                    <div className="camp-card" key={idx}>
                                        <div className={`camp-tag ${c.category.toLowerCase().includes('national') ? 'tag-army' : c.category.toLowerCase().includes('compulsory') ? 'tag-navy' : 'tag-airforce'}`}>
                                            {c.category}
                                        </div>
                                        <h3 style={{ marginTop: '10px' }}>{c.title}</h3>
                                        <p style={{ fontSize: '0.88rem', margin: '10px 0' }}>{c.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <span><i className="fa-solid fa-calendar"></i> {c.duration || c.date}</span>
                                            <span><i className="fa-solid fa-map-location-dot"></i> {c.location}</span>
                                        </div>
                                    </div>
                                ))}
                                {campsList.length === 0 && (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: '1 / -1', textAlign: 'center', padding: '30px' }}>
                                        No camps currently published in the Unit directory.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Leaderboard View */}
                {currentTab === 'leaderboard' && (
                    <div className="view-section active">
                        <div className="container" style={{ paddingTop: '40px' }}>
                            <div className="section-header">
                                <h2>Inter-Squadron Championship 2026-27</h2>
                                <p>Dynamic calculations of active squadron points, competition wins, and attendance deductions</p>
                            </div>

                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Squadron Platoon</th>
                                        <th>Base Points</th>
                                        <th>Comp. Points</th>
                                        <th>Deductions</th>
                                        <th>Overall Score</th>
                                        <th style={{ width: '130px' }}>Breakdown</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((sq, i) => {
                                        const totalDeductions = sq.attendanceDeductions + sq.turnoutDeductions + sq.contributionDeductions;
                                        const isCollapsed = collapsedSq[sq.squadronId];

                                        return (
                                            <React.Fragment key={sq.squadronId}>
                                                <tr>
                                                    <td><strong>#{i + 1}</strong></td>
                                                    <td style={{ textTransform: 'uppercase' }}>
                                                        <strong>{sq.name}</strong>
                                                    </td>
                                                    <td>{sq.basePoints}</td>
                                                    <td style={{ color: 'var(--secondary)', fontWeight: '700' }}>+{sq.compPoints}</td>
                                                    <td style={{ color: 'var(--danger)' }}>-{totalDeductions.toFixed(2)}</td>
                                                    <td><strong>{sq.totalScore} pts</strong></td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-outline" 
                                                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                            onClick={() => toggleBreakdown(sq.squadronId)}
                                                        >
                                                            {isCollapsed ? 'Hide File' : 'View Logs'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isCollapsed && (
                                                    <tr style={{ backgroundColor: '#fdfdfd' }}>
                                                        <td colSpan="7" style={{ padding: '15px 30px', borderLeft: '4px solid var(--primary)' }}>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                                <div>
                                                                    <h5 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '8px', color: 'var(--primary)' }}>Log Breakdown</h5>
                                                                    <ul style={{ fontSize: '0.8rem', listStyle: 'none', padding: 0 }}>
                                                                        <li>Base Points: <strong>{sq.basePoints}</strong></li>
                                                                        <li>Parade Absence Deductions: <strong style={{ color: 'var(--danger)' }}>-{sq.attendanceDeductions}</strong></li>
                                                                        <li>CSM Turnout Penalties: <strong style={{ color: 'var(--danger)' }}>-{sq.turnoutDeductions}</strong></li>
                                                                        <li>SUO Contribution Penalties: <strong style={{ color: 'var(--danger)' }}>-{sq.contributionDeductions}</strong></li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <h5 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '8px', color: 'var(--primary)' }}>Competition Placements</h5>
                                                                    {sq.history.length > 0 ? (
                                                                        <ul style={{ fontSize: '0.8rem', paddingLeft: '15px' }}>
                                                                            {sq.history.map((h, index) => (
                                                                                <li key={index}>
                                                                                    {h.compName}: Place #{h.position} (<strong>+{h.points} pts</strong>) on {h.date}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No competition results recorded yet.</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    {leaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center" style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No squadron point profiles loaded. Run seed script first.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 5. Contact / Notices View */}
                {currentTab === 'contact' && (
                    <div className="view-section active">
                        <div className="container" style={{ paddingTop: '40px' }}>
                            <div className="section-header">
                                <h2>Notices Feed & Contacts</h2>
                                <p>Check Saturday training announcements or reach out to the ANO office</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ marginBottom: '20px' }}><i className="fa-solid fa-bullhorn"></i> Official Unit Bulletin</h3>
                                    <div className="announcements-feed">
                                        {announcements.map((n, i) => (
                                            <div className="announcement-item" key={i} style={{ marginBottom: '20px' }}>
                                                <div className="announcement-main">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                                                        <div className="announcement-title">{n.title}</div>
                                                        {user && ['admin', 'ano', 'suo', 'cqms', 'csm', 'juo'].includes(user.role) && (
                                                            <button 
                                                                className="btn btn-outline" 
                                                                style={{ padding: '4px 8px', fontSize: '0.7rem', borderColor: 'var(--danger)', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                                                                onClick={() => handleDeleteNotice(n._id)}
                                                            >
                                                                <i className="fa-solid fa-trash-can"></i> Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="announcement-body" style={{ marginTop: '5px' }}>{n.body}</div>
                                                </div>
                                                <div className="announcement-meta">
                                                    <span className="date"><i className="fa-regular fa-calendar"></i> {n.date}</span>
                                                    <span className="author">By: {n.postedBy}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {announcements.length === 0 && (
                                            <div className="announcement-item">
                                                <div className="announcement-main">
                                                    <div className="announcement-title">Unit Notice Board Empty</div>
                                                    <div className="announcement-body">No weekly circulars or bulletins posted yet in this database session.</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-card" style={{ padding: '25px', textAlign: 'left', alignSelf: 'start' }}>
                                    <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}><i className="fa-solid fa-building-shield"></i> ANO Office</h3>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}><strong>Associate NCC Officer (ANO)</strong>: Lt. Dr. Raghveder Gautam</p>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}><strong>Office Location</strong>: 3rd floor civil department, DTU</p>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}><strong>Training Schedule</strong>: Every Saturday (0800 hrs to 1300 hrs)</p>
                                    
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                        <h4>Contacts:</h4>
                                        <p style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-envelope"></i> officer.ano@dtuncc.in</p>
                                        <p style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-phone"></i> +91-11-27896543</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. Login View */}
                {currentTab === 'login' && (
                    <div className="view-section active">
                        <div className="login-container">
                            <div className="login-card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '5px', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)' }}></div>
                                <div style={{ padding: '35px' }}>
                                    <img 
                                        src="dtu_ncc_logo_transparent.png" 
                                        alt="DTU NCC Logo" 
                                        style={{ height: '75px', display: 'block', margin: '0 auto 15px auto', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }} 
                                    />
                                    <h3 className="login-title" style={{ textAlign: 'center', fontSize: '1.25rem', borderBottom: 'none', paddingBottom: '0', marginBottom: '25px', color: 'var(--primary)', fontWeight: '700' }}>
                                        1 DBN NCC CADET LOGIN
                                    </h3>
                                    
                                    {loginError && (
                                        <div className="alert alert-danger" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i> {loginError}
                                        </div>
                                    )}
                                    <form onSubmit={handleLoginSubmit}>
                                        <div className="form-group">
                                            <label className="form-label">Official Email Address</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="E.g., name@dtuncc.in"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                                            Sign In
                                        </button>
                                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                            <a 
                                                href="#" 
                                                onClick={(e) => { 
                                                    e.preventDefault(); 
                                                    setForgotMode('menu'); 
                                                    setForgotMsg('');
                                                    setForgotError('');
                                                    setCurrentTab('forgot'); 
                                                }} 
                                                style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
                                            >
                                                Forgot ID or Password?
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Forgot ID / Password Recovery View */}
                                {/* Forgot ID / Password Recovery View */}
                {currentTab === 'forgot' && (
                    <div className="view-section active">
                        <div className="login-container">
                            <div className="login-card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '5px', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)' }}></div>
                                <div style={{ padding: '35px' }}>
                                    <img 
                                        src="dtu_ncc_logo_transparent.png" 
                                        alt="DTU NCC Logo" 
                                        style={{ height: '75px', display: 'block', margin: '0 auto 15px auto', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }} 
                                    />
                                    
                                    <h3 className="login-title" style={{ textAlign: 'center', fontSize: '1.25rem', borderBottom: 'none', paddingBottom: '0', marginBottom: '20px', color: 'var(--primary)', fontWeight: '700' }}>
                                        ACCOUNT RECOVERY
                                    </h3>
                                    {forgotError && (
                                        <div className="alert alert-danger" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i> {forgotError}
                                        </div>
                                    )}
                                    {forgotMsg && (
                                        <div className="alert alert-success" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>
                                            <i className="fa-solid fa-circle-check"></i> {forgotMsg}
                                        </div>
                                    )}
                                    
                                    {!forgotOtpSent ? (
                                        <form onSubmit={handleRecoverAccountVerify}>
                                            <div className="form-group">
                                                <label className="form-label">Full Name *</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="E.g., Cdt Rohit Sharma"
                                                    value={forgotName}
                                                    onChange={(e) => setForgotName(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Date of Birth *</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    value={forgotDob}
                                                    onChange={(e) => setForgotDob(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">10-Digit Mobile Number *</label>
                                                <input 
                                                    type="tel" 
                                                    maxLength={10}
                                                    className="form-control" 
                                                    placeholder="E.g., 9876543214"
                                                    value={forgotContact}
                                                    onChange={(e) => setForgotContact(e.target.value.replace(/\D/g, ''))}
                                                    required 
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                                                Verify & Send OTP
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn" 
                                                onClick={() => {
                                                    setForgotName('');
                                                    setForgotDob('');
                                                    setForgotContact('');
                                                    setCurrentTab('login');
                                                }}
                                                style={{ width: '100%', justifyContent: 'center', marginTop: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
                                            >
                                                Back to Login
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleResetPasswordSubmit}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: '600' }}>Recovered Official Email (ID)</label>
                                                <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                    {forgotEmail}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">OTP Code *</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="6-Digit Reset OTP"
                                                    value={forgotOtpInput}
                                                    onChange={(e) => setForgotOtpInput(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">New Password *</label>
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    placeholder="Min 6 characters"
                                                    value={forgotNewPassword}
                                                    onChange={(e) => setForgotNewPassword(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Confirm New Password *</label>
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    placeholder="Confirm your password"
                                                    value={forgotConfirmPassword}
                                                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                                                Reset Password & Login
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn" 
                                                onClick={() => setForgotOtpSent(false)}
                                                style={{ width: '100%', justifyContent: 'center', marginTop: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
                                            >
                                                Back
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 9. Cadet Registration View */}
                {currentTab === 'register' && !user && (
                    <div className="view-section active">
                        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                            <div className="profile-card" style={{ padding: '35px', textAlign: 'left', maxWidth: '850px', margin: '0 auto' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
                                    <i className="fa-solid fa-user-plus"></i> Cadet Self-Registration Portal
                                </h3>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '25px' }}>
                                    Register your profile to gain access to the Cadet portal. Ensure you verify your Email and Mobile Number with simulated OTP codes.
                                </p>

                                {regMsg && (
                                    <div className="alert alert-success" style={{ marginBottom: '20px', fontSize: '0.88rem' }}>
                                        <i className="fa-solid fa-circle-check"></i> {regMsg}
                                    </div>
                                )}
                                {regErrorMsg && (
                                    <div className="alert alert-danger" style={{ marginBottom: '20px', fontSize: '0.88rem' }}>
                                        <i className="fa-solid fa-triangle-exclamation"></i> {regErrorMsg}
                                    </div>
                                )}

                                <form onSubmit={handleRegisterSubmit}>
                                    {/* SECTION 1: Basic Information */}
                                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '25px' }}>
                                        <legend style={{ padding: '0 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase' }}>Basic Information</legend>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                                                <input type="text" className="form-control" placeholder="E.g., Ankit Kumar" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Date of Birth *</label>
                                                <input type="date" className="form-control" value={regDob} onChange={(e) => setRegDob(e.target.value)} required />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>DLI Number * (Begins with DL2024 or DL2025)</label>
                                                <input type="text" className="form-control" placeholder="E.g., DL2024SD12345" value={regDliNo} onChange={(e) => setRegDliNo(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Squadron Platoon *</label>
                                                <select className="form-control" value={regSquadron} onChange={(e) => setRegSquadron(e.target.value)} required>
                                                    <option value="hq">Headquarters (HQ)</option>
                                                    <option value="alpha">Alpha</option>
                                                    <option value="bravo">Bravo</option>
                                                    <option value="charlie">Charlie</option>
                                                    <option value="delta">Delta</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Rank *</label>
                                                <select className="form-control" value={regRank} onChange={(e) => setRegRank(e.target.value)} required>
                                                    <option value="Cadet">Cadet (Cdt)</option>
                                                    <option value="L/Cpl">Lance Corporal (L/Cpl)</option>
                                                    <option value="Cpl">Corporal (Cpl)</option>
                                                    <option value="Sgt">Sergeant (Sgt)</option>
                                                    <option value="CSM">Company Sergeant Major (CSM)</option>
                                                    <option value="CQMS">Company Quartermaster Sergeant (CQMS)</option>
                                                    <option value="JUO">Junior Under Officer (JUO)</option>
                                                    <option value="SUO">Senior Under Officer (SUO)</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Cadet Year *</label>
                                                <select className="form-control" value={regYear} onChange={(e) => setRegYear(e.target.value)} required>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                </select>
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Mail ID *</label>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        placeholder="E.g., personal@gmail.com" 
                                                        value={regEmail} 
                                                        onChange={(e) => setRegEmail(e.target.value)} 
                                                        disabled={emailOtpVerified}
                                                        required 
                                                    />
                                                    {!emailOtpVerified ? (
                                                        <button type="button" className="btn btn-outline" onClick={handleSendEmailOtp} style={{ whiteSpace: 'nowrap' }}>
                                                            {emailOtpSent ? 'Resend OTP' : 'Send OTP'}
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: 'var(--success)', alignSelf: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <i className="fa-solid fa-circle-check"></i> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                {emailOtpSent && !emailOtpVerified && (
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Enter 6-Digit Email OTP" 
                                                            value={emailOtpInput} 
                                                            onChange={(e) => setEmailOtpInput(e.target.value)} 
                                                        />
                                                        <button type="button" className="btn btn-primary" onClick={handleVerifyEmailOtp}>Verify</button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Password *</label>
                                                <input type="password" className="form-control" placeholder="Choose a secure password (min 6 characters)" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* SECTION 2: Academic Details */}
                                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '25px' }}>
                                        <legend style={{ padding: '0 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase' }}>Academic Details (Optional)</legend>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Course</label>
                                                <select className="form-control" value={regCourse} onChange={(e) => setRegCourse(e.target.value)}>
                                                    <option value="Btech">B.Tech</option>
                                                    <option value="BSMS">BS-MS</option>
                                                    <option value="BArch">B.Arch</option>
                                                    <option value="BSc">B.Sc</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Branch</label>
                                                <input type="text" className="form-control" placeholder="E.g., Computer Science, Biotech" value={regBranch} onChange={(e) => setRegBranch(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>College Roll Number</label>
                                                <input type="text" className="form-control" placeholder="E.g., 2K24/CO/123" value={regCollegeRollNo} onChange={(e) => setRegCollegeRollNo(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Academic Year</label>
                                                <select className="form-control" value={regAcademicYear} onChange={(e) => setRegAcademicYear(e.target.value)}>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                </select>
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* SECTION 3: Contact Information */}
                                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '25px' }}>
                                        <legend style={{ padding: '0 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase' }}>Contact Information</legend>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Mobile Number *</label>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <input 
                                                        type="tel" 
                                                        maxLength={10}
                                                        className="form-control" 
                                                        placeholder="10-digit mobile number" 
                                                        value={regContact} 
                                                        onChange={(e) => setRegContact(e.target.value.replace(/\D/g, ''))} 
                                                        disabled={phoneOtpVerified}
                                                        required 
                                                    />
                                                    {!phoneOtpVerified ? (
                                                        <button type="button" className="btn btn-outline" onClick={handleSendPhoneOtp} style={{ whiteSpace: 'nowrap' }}>
                                                            {phoneOtpSent ? 'Resend OTP' : 'Send OTP'}
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: 'var(--success)', alignSelf: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <i className="fa-solid fa-circle-check"></i> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                {phoneOtpSent && !phoneOtpVerified && (
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Enter 6-Digit Mobile OTP" 
                                                            value={phoneOtpInput} 
                                                            onChange={(e) => setPhoneOtpInput(e.target.value)} 
                                                        />
                                                        <button type="button" className="btn btn-primary" onClick={handleVerifyPhoneOtp}>Verify</button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Alternate Mobile Number</label>
                                                <input type="text" className="form-control" placeholder="Parents/backup number" value={regAltContact} onChange={(e) => setRegAltContact(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                 <label className="form-label" style={{ fontSize: '0.78rem' }}>Hostel / Day Scholar / PG *</label>
                                                 <select className="form-control" value={regResidenceType} onChange={(e) => setRegResidenceType(e.target.value)} required>
                                                     <option value="Hostel">Hostel Resident</option>
                                                     <option value="Day Scholar">Day Scholar</option>
                                                     <option value="PG/Flat">PG/Flat</option>
                                                 </select>
                                             </div>
                                             {regResidenceType === 'Hostel' && (
                                                 <div className="form-group">
                                                     <label className="form-label" style={{ fontSize: '0.78rem' }}>Hostel Number *</label>
                                                     <input type="text" className="form-control" placeholder="E.g., Hostel 3 (Kailash)" value={regHostelNo} onChange={(e) => setRegHostelNo(e.target.value)} required />
                                                 </div>
                                             )}
                                             {regResidenceType === 'PG/Flat' && (
                                                 <div className="form-group">
                                                     <label className="form-label" style={{ fontSize: '0.78rem' }}>PG/Flat Location *</label>
                                                     <input type="text" className="form-control" placeholder="E.g., Sector 15 Rohini" value={regPgLocation} onChange={(e) => setRegPgLocation(e.target.value)} required />
                                                 </div>
                                             )}
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Address *</label>
                                                <input type="text" className="form-control" placeholder="House/Hostel name and room number" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>City *</label>
                                                <input type="text" className="form-control" placeholder="E.g., New Delhi" value={regCity} onChange={(e) => setRegCity(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Pincode *</label>
                                                <input type="text" className="form-control" placeholder="E.g., 110042" value={regPincode} onChange={(e) => setRegPincode(e.target.value)} required />
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* SECTION 4: Parent's Details */}
                                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '25px' }}>
                                        <legend style={{ padding: '0 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase' }}>Parent's / Guardian's Details</legend>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Father's Name *</label>
                                                <input type="text" className="form-control" placeholder="Father's full name" value={regFatherName} onChange={(e) => setRegFatherName(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Mother's Name *</label>
                                                <input type="text" className="form-control" placeholder="Mother's full name" value={regMotherName} onChange={(e) => setRegMotherName(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Guardian's Name</label>
                                                <input type="text" className="form-control" placeholder="Guardian's name (if applicable)" value={regGuardianName} onChange={(e) => setRegGuardianName(e.target.value)} />
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* SECTION 5: Medical Information */}
                                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '25px' }}>
                                        <legend style={{ padding: '0 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase' }}>Medical Information</legend>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Blood Group *</label>
                                                <select className="form-control" value={regBloodGroup} onChange={(e) => setRegBloodGroup(e.target.value)} required>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Allergies</label>
                                                <input type="text" className="form-control" placeholder="E.g., Peanuts, Dust (if any)" value={regAllergies} onChange={(e) => setRegAllergies(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Existing Medical Conditions</label>
                                                <input type="text" className="form-control" placeholder="E.g., Asthma, High BP" value={regMedicalConditions} onChange={(e) => setRegMedicalConditions(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Regular Medications</label>
                                                <input type="text" className="form-control" placeholder="E.g., Inhalers, daily pills" value={regMedications} onChange={(e) => setRegMedications(e.target.value)} />
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* SECTION 6: Camps Details */}
                                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '25px' }}>
                                        <legend style={{ padding: '0 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', textTransform: 'uppercase' }}>Camps Attended & Achievements</legend>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>NCC Camps Attended</label>
                                                <textarea className="form-control" placeholder="Name all the camps you have attended (e.g., CATC, TSC, RDC, EBSB, ALC)" rows="3" value={regCampsAttended} onChange={(e) => setRegCampsAttended(e.target.value)}></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Any Other Details / Achievements</label>
                                                <textarea className="form-control" placeholder="NCC certificate exams passed, sports trophies, firing accolades, etc." rows="2" value={regOtherDetails} onChange={(e) => setRegOtherDetails(e.target.value)}></textarea>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                                        <i className="fa-solid fa-user-check"></i> Submit Registration Application
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rank Panel Tab View */}
                {currentTab === 'rankpanel' && (() => {
                    const renderProfileCard = (name, rankLabel, badgeColor, borderLeftColor, imgUrl) => (
                        <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderLeft: `5px solid ${borderLeftColor}`, minHeight: '165px', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                            {imgUrl === 'icon-vc' ? (
                                <div style={{ width: '100px', height: '125px', minWidth: '100px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: '#fcfcfc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                                </div>
                            ) : imgUrl ? (
                                <img src={imgUrl} alt={name} style={{ width: '100px', height: '125px', minWidth: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                            ) : (
                                <div style={{ width: '100px', height: '125px', minWidth: '100px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: '#fcfcfc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-user" style={{ fontSize: '1.8rem', color: 'var(--text-muted)' }}></i>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>Photo</span>
                                </div>
                            )}
                            <div style={{ textAlign: 'left' }}>
                                <span className="badge" style={{ backgroundColor: badgeColor, color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px' }}>{rankLabel}</span>
                                <h3 style={{ margin: '8px 0 2px 0', fontSize: '1.15rem', fontWeight: '700', color: 'var(--navy-blue)' }}>{name}</h3>
                            </div>
                        </div>
                    );

                    return (
                        <div className="view-section active">
                            <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                                <div className="section-header">
                                    <h2>Command Leadership Rank Panel (2026-27)</h2>
                                    <p>Hierarchy, NCO commands, and cadet leadership chain of 1 DBN NCC Unit, DTU</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', maxWidth: '1000px', margin: '0 auto' }}>
                                    
                                    {/* 1. Patron & Unit Command */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Patron & Unit Command
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {renderProfileCard("Prof. Prateek Sharma", "Colonel Commandant", "var(--primary)", "var(--primary)", "gallery/vc_prateek.png")}
                                            {renderProfileCard("Lt. Dr. Raghveder Gautam", "Associate NCC Officer", "var(--saffron)", "var(--saffron)", "gallery/ano_raghvender.jpg")}
                                        </div>
                                    </div>

                                    {/* 2. Second in Command (2IC) & Senior Command */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Senior Command
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {renderProfileCard("Piyush Kumar", "Senior Under Officer", "var(--army-red)", "var(--army-red)", "gallery/suo_piyush.jpg")}
                                            {renderProfileCard("Ankit Kumar", "JUO - Second in Command (2IC)", "var(--secondary)", "var(--secondary)", "gallery/juo_ankit.jpg")}
                                        </div>
                                    </div>

                                    {/* 3. Junior Under Officers (JUO) */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Junior Under Officers (JUO)
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {[
                                                { name: "Abhinav Kumar", img: "gallery/juo_abhinav.png" },
                                                { name: "Adamya Naorem", img: "gallery/juo_adamya.png" },
                                                { name: "Samarth Kadyan", img: "gallery/juo_samarth.png" }
                                            ].map((juo, idx) => (
                                                <span key={idx}>{renderProfileCard(juo.name, "Junior Under Officer", "var(--primary)", "var(--primary)", juo.img)}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 4. CSM */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Company Sergeant Major (CSM)
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {[
                                                { name: "Akshat Tiwari", img: null },
                                                { name: "Shreyansh Gupta", img: "gallery/csm_shreyansh.jpg" }
                                            ].map((csm, idx) => (
                                                <span key={idx}>{renderProfileCard(csm.name, "Company Sergeant Major", "var(--secondary)", "var(--secondary)", csm.img)}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 5. CQMS */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Company Quartermaster Sergeant (CQMS)
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 350px))', gap: '20px' }}>
                                            {renderProfileCard("Ankit Singh", "CQMS", "var(--secondary)", "var(--secondary)", "gallery/cqms_ankit.png")}
                                        </div>
                                    </div>

                                    {/* 6. Sergeants (Sgt) */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Sergeants (Sgt)
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {[
                                                "Shivam Pandey", "M. Vishnu", "Ritik Thakur",
                                                "Nishant Tiwari", "Mayank Rohilla (PT)", "Pratik (Media)"
                                            ].map((name, idx) => (
                                                <span key={idx}>{renderProfileCard(name, "Sergeant", "var(--text-muted)", "var(--text-muted)", null)}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 7. Corporals (Cpl) */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Corporals (Cpl)
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {[
                                                "Adarsh", "Nikhil Kumar", "Yash Lohchab",
                                                "Vishal Singh", "Nikhil Rai"
                                            ].map((name, idx) => (
                                                <span key={idx}>{renderProfileCard(name, "Corporal", "var(--text-muted)", "var(--text-muted)", null)}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 8. Lance Corporals (L/CPL) */}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px', marginBottom: '15px', textAlign: 'left', fontWeight: '700' }}>
                                            Lance Corporals (L/CPL)
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
                                            {[
                                                "Ujjwal Jha", "Suraj Kumar", "Kartik", "Kundan Kumar",
                                                "Ankur Debsharma", "Nikhil Kumar", "Shrish Chand", "Krishna Yadav"
                                            ].map((name, idx) => (
                                                <span key={idx}>{renderProfileCard(name, "Lance Corporal", "var(--text-muted)", "var(--text-muted)", null)}</span>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })()}                {/* 7. Cadet / Admin Portal View */}
                {currentTab === 'dashboard' && user && (
                    <div className="view-section active">
                        {['admin', 'ano', 'suo', 'cqms', 'csm', 'juo'].includes(user.role) ? (
                            /* Admin Management View */
                            <div className="container" style={{ paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
                                    <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
                                        <h2>Command Operations Dashboard</h2>
                                        <p>Welcome, {getRoleDisplayName(user.role)}. Manage 1 DBN unit records, notice boards, and leave permits.</p>
                                    </div>
                                    <button className="btn btn-outline" onClick={handleResetDatabase} style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.8rem', padding: '8px 16px' }}>
                                        <i className="fa-solid fa-triangle-exclamation"></i> Reset Database
                                    </button>
                                </div>

                                <div className="admin-dashboard-flex">
                                    {/* Sidebar Simulators */}
                                    <div className="admin-consoles-section">
                                        <h3 className="admin-consoles-title">
                                            <i className="fa-solid fa-gears"></i> Command Operations & Simulation Consoles
                                        </h3>
                                        <div className="admin-consoles-grid">
                                        {/* Attendance simulator */}
                                        <div className="profile-card" style={{ textAlign: 'left', padding: '22px' }}>
                                            <h3 style={{ color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '5px', fontWeight: '700' }}>
                                                <i className="fa-solid fa-gamepad"></i> Attendance Simulator
                                            </h3>
                                            {simMsg && <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '0.75rem' }}>{simMsg}</div>}
                                            <form onSubmit={handleAttendanceSim}>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Cadet</label>
                                                    <select 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simCadetId}
                                                        onChange={(e) => setSimCadetId(e.target.value)}
                                                        required
                                                    >
                                                        {cadets.map(c => <option key={c.cadetId} value={c.cadetId}>{c.name} ({c.cadetId})</option>)}
                                                        {cadets.length === 0 && <option value="">No cadets enrolled</option>}
                                                    </select>
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Parade Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simDate}
                                                        onChange={(e) => setSimDate(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
                                                    <select 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simStatus}
                                                        onChange={(e) => setSimStatus(e.target.value)}
                                                        required
                                                    >
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent (Triggers ₹50 Fine)</option>
                                                        <option value="Excused">Excused (No Fine)</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                                                    <i className="fa-solid fa-arrows-rotate"></i> Sync Attendance
                                                </button>
                                            </form>
                                        </div>

                                        {/* CSM Turnout Penalty */}
                                        <div className="profile-card" style={{ textAlign: 'left', padding: '22px' }}>
                                            <h3 style={{ color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '5px', fontWeight: '700' }}>
                                                <i className="fa-solid fa-shirt"></i> Turnout (CSM)
                                            </h3>
                                            {simTurnoutMsg && <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '0.75rem' }}>{simTurnoutMsg}</div>}
                                            <form onSubmit={handleTurnoutSubmit}>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Squadron</label>
                                                    <select 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simTurnoutSquadron}
                                                        onChange={(e) => setSimTurnoutSquadron(e.target.value)}
                                                        required
                                                    >
                                                        <option value="alpha">Alpha</option>
                                                        <option value="bravo">Bravo</option>
                                                        <option value="charlie">Charlie</option>
                                                        <option value="delta">Delta</option>
                                                    </select>
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Deduction (0.1 to 1.0)</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        min="0" max="1" step="0.1"
                                                        value={simTurnoutDeduction}
                                                        onChange={(e) => setSimTurnoutDeduction(e.target.value)}
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }} 
                                                        required 
                                                    />
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simTurnoutDate}
                                                        onChange={(e) => setSimTurnoutDate(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                                                    <i className="fa-solid fa-minus"></i> Apply CSM Penalty
                                                </button>
                                            </form>
                                        </div>

                                        {/* SUO Contribution */}
                                        <div className="profile-card" style={{ textAlign: 'left', padding: '22px' }}>
                                            <h3 style={{ color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '5px', fontWeight: '700' }}>
                                                <i className="fa-solid fa-people-group"></i> Contribution (SUO)
                                            </h3>
                                            {simContributionMsg && <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '0.75rem' }}>{simContributionMsg}</div>}
                                            <form onSubmit={handleContributionSubmit}>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Squadron</label>
                                                    <select 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simContributionSquadron}
                                                        onChange={(e) => setSimContributionSquadron(e.target.value)}
                                                        required
                                                    >
                                                        <option value="alpha">Alpha</option>
                                                        <option value="bravo">Bravo</option>
                                                        <option value="charlie">Charlie</option>
                                                        <option value="delta">Delta</option>
                                                    </select>
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Deduction Points</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        step="0.5"
                                                        value={simContributionDeduction}
                                                        onChange={(e) => setSimContributionDeduction(e.target.value)}
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }} 
                                                        required 
                                                    />
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        value={simContributionDate}
                                                        onChange={(e) => setSimContributionDate(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                                                    <i className="fa-solid fa-minus"></i> Apply SUO Penalty
                                                </button>
                                            </form>
                                        </div>

                                        {/* Notice Board Console */}
                                        <div className="profile-card" style={{ textAlign: 'left', padding: '22px' }}>
                                            <h3 style={{ color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '5px', fontWeight: '700' }}>
                                                <i className="fa-solid fa-bullhorn"></i> Notice Board Console
                                            </h3>
                                            {noticeMsg && <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '0.75rem' }}>{noticeMsg}</div>}
                                            <form onSubmit={handleNoticeSubmit}>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Notice Title</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        placeholder="E.g., Special Parade Drill"
                                                        value={noticeTitle}
                                                        onChange={(e) => setNoticeTitle(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Notice Body</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                        placeholder="Write notice description..."
                                                        rows="3"
                                                        value={noticeBody}
                                                        onChange={(e) => setNoticeBody(e.target.value)}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                                                    <i className="fa-solid fa-paper-plane"></i> Post Notice
                                                </button>
                                            </form>
                                        </div>

                                        {/* Camp Manager Console */}
                                        {user.role === 'admin' && (
                                            <div className="profile-card" style={{ textAlign: 'left', padding: '22px' }}>
                                                <h3 style={{ color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '5px', fontWeight: '700' }}>
                                                    <i className="fa-solid fa-tent"></i> Camp Manager Console
                                                </h3>
                                                {campMsg && <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '0.75rem' }}>{campMsg}</div>}
                                                <form onSubmit={handleCampSubmit}>
                                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Camp Name</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                            placeholder="E.g., Republic Day Camp"
                                                            value={campTitle}
                                                            onChange={(e) => setCampTitle(e.target.value)}
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
                                                        <select 
                                                            className="form-control" 
                                                            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                            value={campCategory}
                                                            onChange={(e) => setCampCategory(e.target.value)}
                                                            required
                                                        >
                                                            <option value="National Level">National Level</option>
                                                            <option value="Annual Compulsory">Annual Compulsory</option>
                                                            <option value="Adventure">Adventure</option>
                                                            <option value="Attachment">Attachment</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Location</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                            placeholder="E.g., Cantonment, New Delhi"
                                                            value={campLocation}
                                                            onChange={(e) => setCampLocation(e.target.value)}
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Duration / Dates</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                            placeholder="E.g., Jan 2027 or 10 Days"
                                                            value={campDuration}
                                                            onChange={(e) => setCampDuration(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                                                        <textarea 
                                                            className="form-control" 
                                                            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                                            placeholder="Describe camp activities..."
                                                            rows="2"
                                                            value={campDescription}
                                                            onChange={(e) => setCampDescription(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                                                        <i className="fa-solid fa-plus"></i> Publish Camp
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                    </div>

                                    {/* Main Area */}
                                    <div className="dashboard-main">
                                        {/* Leave approvals */}
                                        <div className="dashboard-section" style={{ padding: '25px' }}>
                                            <h3 style={{ fontSize: '1.15rem', marginBottom: '15px', fontWeight: '700' }}><i className="fa-solid fa-envelope-open-text"></i> Leave Exemption Requests Approvals</h3>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.85rem' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Submitted</th>
                                                            <th>Cadet ID</th>
                                                            <th>Parade Date</th>
                                                            <th>Reason Description</th>
                                                            <th>Status</th>
                                                            <th style={{ width: '160px' }}>Review Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {exemptions.map(e => (
                                                            <tr key={e._id}>
                                                                <td>{e.dateSubmitted}</td>
                                                                <td><strong>{e.cadetId}</strong></td>
                                                                <td>{e.date}</td>
                                                                <td>{e.reason}</td>
                                                                <td>
                                                                    <span className={`badge ${e.status === 'Approved' ? 'badge-success' : e.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                                                                        {e.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {e.status === 'Pending' ? (
                                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                                            <button 
                                                                                className="btn btn-primary" 
                                                                                style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                                                                                onClick={() => handleExemptionDecision(e._id, 'Approved')}
                                                                            >
                                                                                Approve
                                                                            </button>
                                                                            <button 
                                                                                className="btn btn-outline" 
                                                                                style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                                                                onClick={() => handleExemptionDecision(e._id, 'Rejected')}
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Processed</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {exemptions.length === 0 && (
                                                            <tr>
                                                                <td colSpan="6" className="text-center" style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No leave applications submitted yet in database.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Competition Result logger */}
                                        <div className="dashboard-section" style={{ padding: '25px' }}>
                                            <h3 style={{ fontSize: '1.15rem', marginBottom: '15px', fontWeight: '700' }}><i className="fa-solid fa-trophy"></i> Championship Placements Logger</h3>
                                            {simCompMsg && <div className="alert alert-success" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>{simCompMsg}</div>}
                                            <form onSubmit={handleCompetitionSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', alignItems: 'end' }}>
                                                <div className="form-group" style={{ marginBottom: '0' }}>
                                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Select Competition</label>
                                                    <select 
                                                        className="form-control" 
                                                        style={{ fontSize: '0.85rem' }}
                                                        value={simCompId}
                                                        onChange={(e) => {
                                                            setSimCompId(e.target.value);
                                                            if (e.target.value === 'cross-country') {
                                                                setSimCompName('Cross-Country');
                                                                setSimCompType('Major');
                                                            } else if (e.target.value === 'quarter-guard') {
                                                                setSimCompName('Quarter Guard');
                                                                setSimCompType('Major');
                                                            } else {
                                                                setSimCompName('100m Athletics');
                                                                setSimCompType('Athletics');
                                                            }
                                                        }}
                                                        required
                                                    >
                                                        <option value="cross-country">Cross-Country (Major)</option>
                                                        <option value="quarter-guard">Quarter Guard (Major)</option>
                                                        <option value="100m-run">100m Sprint (Athletics)</option>
                                                        <option value="relay-run">4x100m Relay (Athletics)</option>
                                                    </select>
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '0' }}>
                                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Select Squadron</label>
                                                    <select className="form-control" style={{ fontSize: '0.85rem' }} value={simCompSquadron} onChange={(e) => setSimCompSquadron(e.target.value)} required>
                                                        <option value="alpha">Alpha</option>
                                                        <option value="bravo">Bravo</option>
                                                        <option value="charlie">Charlie</option>
                                                        <option value="delta">Delta</option>
                                                    </select>
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '0' }}>
                                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Position Place</label>
                                                    <select className="form-control" style={{ fontSize: '0.85rem' }} value={simCompPosition} onChange={(e) => setSimCompPosition(e.target.value)} required>
                                                        <option value="1">1st Place</option>
                                                        <option value="2">2nd Place</option>
                                                        <option value="3">3rd Place</option>
                                                        <option value="4">4th Place</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '10px' }}>
                                                    <i className="fa-solid fa-plus"></i> Record Result
                                                </button>
                                            </form>
                                        </div>

                                        {/* Administration & Squadron-wise Colored Tables Section (for Admin/ANO/SUO/CQMS/CSM only) */}
                                        {user && ['admin', 'ano', 'suo', 'cqms', 'csm'].includes(user.role) && (
                                            <div className="dashboard-section" style={{ padding: '25px', marginBottom: '25px', borderLeft: '5px solid var(--primary)', textAlign: 'left' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: 'var(--navy-blue)' }}>
                                                            <i className="fa-solid fa-users-viewfinder"></i> Complete Squadron-wise Directory
                                                        </h3>
                                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                            View complete cadet registries grouped by Alpha, Bravo, Charlie, and Delta Squadrons, plus Administration members.
                                                        </p>
                                                    </div>
                                                    <button 
                                                        className="btn btn-primary" 
                                                        style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                        onClick={() => setShowSquadronGroupTables(!showSquadronGroupTables)}
                                                    >
                                                        {showSquadronGroupTables ? (
                                                            <>Hide Directory <i className="fa-solid fa-chevron-up"></i></>
                                                        ) : (
                                                            <>Show Directory <i className="fa-solid fa-chevron-down"></i></>
                                                        )}
                                                    </button>
                                                </div>

                                                {showSquadronGroupTables && (
                                                    <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                                        
                                                        {/* 1. Administration Registry Table */}
                                                        <div style={{ border: '1px solid #cbd5e1', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#f8fafc' }}>
                                                            <h4 style={{ color: '#475569', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #cbd5e1', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <i className="fa-solid fa-shield-halved"></i> Unit Administration Registry
                                                            </h4>
                                                            <div style={{ overflowX: 'auto' }}>
                                                                <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.82rem' }}>
                                                                    <thead>
                                                                        <tr style={{ backgroundColor: '#e2e8f0' }}>
                                                                            <th>Rank & Name</th>
                                                                            <th>Role/Designation</th>
                                                                            <th>DLI / Regt No</th>
                                                                            <th>Squadron</th>
                                                                            <th>Contact Details</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {cadets
                                                                            .filter(c => ['SUO', 'CSM', 'CQMS', 'ANO'].includes(c.rank))
                                                                            .map(c => (
                                                                                <tr key={c._id}>
                                                                                    <td>
                                                                                        <button 
                                                                                            onClick={() => setSelectedViewCadet(c)}
                                                                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                                                                        >
                                                                                            {c.rank} {c.name}
                                                                                        </button>
                                                                                    </td>
                                                                                    <td><span className="badge" style={{ backgroundColor: '#475569', color: '#fff', fontSize: '0.7rem' }}>{c.rank === 'ANO' ? 'Associate Officer' : 'Command Board'}</span></td>
                                                                                    <td>{c.enrollmentNo || c.dliNo}</td>
                                                                                    <td style={{ textTransform: 'uppercase' }}>{c.squadron}</td>
                                                                                    <td>{c.contact} | {c.email}</td>
                                                                                </tr>
                                                                            ))}
                                                                        {/* Fallback for admin user accounts which don't have cadet profiles */}
                                                                        <tr>
                                                                            <td><strong>Administrator (System)</strong></td>
                                                                            <td><span className="badge" style={{ backgroundColor: '#1e293b', color: '#fff', fontSize: '0.7rem' }}>Super Admin</span></td>
                                                                            <td>N/A</td>
                                                                            <td>HQ</td>
                                                                            <td>admin@dtuncc.in</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* 2. Squadron Tables (Colored Red, Yellow, Blue, Green) */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                                            
                                                            {/* Headquarters Squadron - SLATE table */}
                                                            <div style={{ border: '2px solid #475569', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#f1f5f9' }}>
                                                                <h4 style={{ color: '#475569', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #cbd5e1', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#475569' }}></span> Headquarters Platoon (HQ Group)
                                                                </h4>
                                                                <SquadronTable squadronId="hq" borderTheme="#475569" />
                                                            </div>
                                                            
                                                            {/* Alpha Squadron - RED table */}
                                                            <div style={{ border: '2px solid #ef4444', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#fff5f5' }}>
                                                                <h4 style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #fca5a5', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> Alpha Squadron (Red Group)
                                                                </h4>
                                                                <SquadronTable squadronId="alpha" borderTheme="#ef4444" />
                                                            </div>

                                                            {/* Bravo Squadron - YELLOW table */}
                                                            <div style={{ border: '2px solid #eab308', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#fefce8' }}>
                                                                <h4 style={{ color: '#ca8a04', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #fef08a', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></span> Bravo Squadron (Yellow Group)
                                                                </h4>
                                                                <SquadronTable squadronId="bravo" borderTheme="#eab308" />
                                                            </div>

                                                            {/* Charlie Squadron - BLUE table */}
                                                            <div style={{ border: '2px solid #3b82f6', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#eff6ff' }}>
                                                                <h4 style={{ color: '#3b82f6', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #93c5fd', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Charlie Squadron (Blue Group)
                                                                </h4>
                                                                <SquadronTable squadronId="charlie" borderTheme="#3b82f6" />
                                                            </div>

                                                            {/* Delta Squadron - GREEN table */}
                                                            <div style={{ border: '2px solid #22c55e', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#f0fdf4' }}>
                                                                <h4 style={{ color: '#15803d', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #86efac', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span> Delta Squadron (Green Group)
                                                                </h4>
                                                                <SquadronTable squadronId="delta" borderTheme="#22c55e" />
                                                            </div>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Cadet CRUD Directory */}
                                        <div className="dashboard-section" style={{ padding: '25px' }}>
                                            <h3 style={{ fontSize: '1.15rem', marginBottom: '15px', fontWeight: '700' }}><i className="fa-solid fa-address-book"></i> Active Cadet Directory</h3>
                                            
                                            {/* 1. Pending Approvals Sub-section */}
                                            {cadets.filter(c => !c.approved).length > 0 && (
                                                <div style={{ marginBottom: '25px', backgroundColor: '#fff9f0', border: '1px solid #ffe8cc', borderRadius: 'var(--radius-md)', padding: '15px' }}>
                                                    <h4 style={{ color: '#d97706', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <i className="fa-solid fa-user-clock"></i> Pending Registration Approvals
                                                    </h4>
                                                    <div style={{ overflowX: 'auto' }}>
                                                        <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.78rem' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>DLI (Regt No)</th>
                                                                    <th>Squadron</th>
                                                                    <th>Rank</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {cadets.filter(c => !c.approved).map(c => (
                                                                    <tr key={c._id}>
                                                                        <td>
                                                                            <button 
                                                                                onClick={() => setSelectedViewCadet(c)}
                                                                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                                                            >
                                                                                {c.name}
                                                                            </button>
                                                                        </td>
                                                                        <td>{c.enrollmentNo || c.dliNo}</td>
                                                                        <td style={{ textTransform: 'uppercase' }}>{c.squadron}</td>
                                                                        <td>{c.rank}</td>
                                                                        <td>
                                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                                <button className="btn btn-primary" onClick={() => handleApproveCadet(c._id)} style={{ padding: '4px 8px', fontSize: '0.7rem', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}>Approve</button>
                                                                                <button className="btn btn-outline" onClick={() => handleDeleteClick(c._id)} style={{ padding: '4px 8px', fontSize: '0.7rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Reject</button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. Squadron Filter Tabs */}
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                                {['all', 'alpha', 'bravo', 'charlie', 'delta'].map(sq => (
                                                    <button 
                                                        key={sq}
                                                        className={`btn ${squadronFilter === sq ? 'btn-primary' : 'btn-outline'}`}
                                                        style={{ padding: '6px 12px', fontSize: '0.78rem', textTransform: 'uppercase' }}
                                                        onClick={() => setSquadronFilter(sq)}
                                                    >
                                                        {sq === 'all' ? 'All Squadrons' : `${sq} Squadron`}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* 3. Filtered Cadets List */}
                                            <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto' }}>
                                                <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.82rem' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Rank & Name (Click for Details)</th>
                                                            <th>ID</th>
                                                            <th>DLI / Regt No</th>
                                                            <th>Squadron</th>
                                                            <th>Contact</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cadets
                                                            .filter(c => c.approved)
                                                            .filter(c => squadronFilter === 'all' || c.squadron === squadronFilter)
                                                            .map(c => (
                                                                <tr key={c._id}>
                                                                    <td>
                                                                        <button 
                                                                            onClick={() => setSelectedViewCadet(c)}
                                                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                                                            title="View full cadet profile details"
                                                                        >
                                                                            {c.rank} {c.name}
                                                                        </button>
                                                                    </td>
                                                                    <td>{c.cadetId}</td>
                                                                    <td>{c.enrollmentNo || c.dliNo}</td>
                                                                    <td style={{ textTransform: 'uppercase' }}>{c.squadron}</td>
                                                                    <td>{c.contact}</td>
                                                                    <td><span className="badge badge-success">Approved</span></td>
                                                                    <td>
                                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                                            <button className="btn btn-outline" onClick={() => handleEditClick(c)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}><i className="fa-solid fa-pen"></i></button>
                                                                            <button className="btn btn-outline" onClick={() => handleDeleteClick(c._id)} style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}><i className="fa-solid fa-trash"></i></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        {cadets.filter(c => c.approved).filter(c => squadronFilter === 'all' || c.squadron === squadronFilter).length === 0 && (
                                                            <tr>
                                                                <td colSpan="7" className="text-center" style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No enrolled cadets found for the selected squadron filter.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Cadet CRUD form (Only shown when editing) */}
                                            {editingCadetId && (
                                                <div id="cadet-form-section" style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                                                    <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '15px', fontWeight: '700' }}>
                                                        <i className="fa-solid fa-user-pen"></i> Update Cadet Record
                                                    </h4>
                                                    {adminCadetMsg && <div className="alert alert-success" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>{adminCadetMsg}</div>}
                                                    <form onSubmit={handleCadetSubmit}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                                                                <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetName} onChange={(e) => setCadetName(e.target.value)} required />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Date of Birth *</label>
                                                                <input type="date" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetDob} onChange={(e) => setCadetDob(e.target.value)} required />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Regimental No *</label>
                                                                <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetEnrollment} onChange={(e) => setCadetEnrollment(e.target.value)} required />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Squadron *</label>
                                                                <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetSquadron} onChange={(e) => setCadetSquadron(e.target.value)} required>
                                                                    <option value="hq">Headquarters (HQ)</option>
                                                                    <option value="alpha">Alpha</option>
                                                                    <option value="bravo">Bravo</option>
                                                                    <option value="charlie">Charlie</option>
                                                                    <option value="delta">Delta</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Rank *</label>
                                                                <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetRank} onChange={(e) => setCadetRank(e.target.value)} required>
                                                                    <option value="Cadet">Cadet (Cdt)</option>
                                                                    <option value="L/Cpl">Lance Corporal (L/Cpl)</option>
                                                                    <option value="Cpl">Corporal (Cpl)</option>
                                                                    <option value="Sgt">Sergeant (Sgt)</option>
                                                                    <option value="CSM">Company Sergeant Major (CSM)</option>
                                                                    <option value="CQMS">Company Quartermaster Sergeant (CQMS)</option>
                                                                    <option value="JUO">Junior Under Officer (JUO)</option>
                                                                    <option value="SUO">Senior Under Officer (SUO)</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Wing *</label>
                                                                <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetWing} onChange={(e) => setCadetWing(e.target.value)} required>
                                                                    <option value="Army">Army</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Cadet Year *</label>
                                                                <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetYear} onChange={(e) => setCadetYear(e.target.value)} required>
                                                                    <option value="2">2nd Year</option>
                                                                    <option value="3">3rd Year</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Contact Number *</label>
                                                                <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetContact} onChange={(e) => setCadetContact(e.target.value)} required />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Email Address (@dtuncc.in) *</label>
                                                                <input type="email" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetEmail} onChange={(e) => setCadetEmail(e.target.value)} required />
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Hostel / Day Scholar / PG *</label>
                                                                <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetResidenceType} onChange={(e) => setCadetResidenceType(e.target.value)} required>
                                                                    <option value="Hostel">Hostel Resident</option>
                                                                    <option value="Day Scholar">Day Scholar</option>
                                                                    <option value="PG/Flat">PG/Flat</option>
                                                                </select>
                                                            </div>
                                                            {cadetResidenceType === 'Hostel' && (
                                                                <div className="form-group">
                                                                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Hostel Number *</label>
                                                                    <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} placeholder="E.g., Hostel 3" value={cadetHostelNo} onChange={(e) => setCadetHostelNo(e.target.value)} required />
                                                                </div>
                                                            )}
                                                            {cadetResidenceType === 'PG/Flat' && (
                                                                <div className="form-group">
                                                                    <label className="form-label" style={{ fontSize: '0.78rem' }}>PG/Flat Location *</label>
                                                                    <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} placeholder="E.g., Sector 15" value={cadetPgLocation} onChange={(e) => setCadetPgLocation(e.target.value)} required />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                                            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                                                                <i className="fa-solid fa-floppy-disk"></i> Save Updates
                                                            </button>
                                                            <button type="button" className="btn btn-outline" onClick={() => { setEditingCadetId(null); setCadetName(''); setCadetEnrollment(''); setCadetContact(''); setCadetEmail(''); setCadetDob(''); setCadetResidenceType('Hostel'); setCadetHostelNo(''); setCadetPgLocation(''); }} style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>

                                        {/* Fines and logs summary side-by-side */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div className="dashboard-section" style={{ padding: '20px' }}>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Live Unit Attendance Logs</h3>
                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                    <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.82rem' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Date</th>
                                                                <th>Cadet ID</th>
                                                                <th>Status</th>
                                                                <th>Marked By</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {attendance.slice(0, 8).map((a, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{a.date}</td>
                                                                    <td><strong>{a.cadetId}</strong></td>
                                                                    <td><span className={`badge ${a.status === 'Present' ? 'badge-success' : a.status === 'Absent' ? 'badge-danger' : 'badge-warning'}`}>{a.status}</span></td>
                                                                    <td>{a.markedBy}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="dashboard-section" style={{ padding: '20px' }}>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Unpaid Fines Ledger</h3>
                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                    <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.82rem' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Cadet ID</th>
                                                                <th>Date</th>
                                                                <th>Amount</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {fines.filter(f => f.status === 'Unpaid').map(f => (
                                                                <tr key={f._id}>
                                                                    <td><strong>{f.cadetId}</strong></td>
                                                                    <td>{f.dateCreated}</td>
                                                                    <td style={{ color: 'var(--danger)', fontWeight: '700' }}>₹{f.amount}</td>
                                                                    <td><span className="badge badge-danger">Unpaid</span></td>
                                                                    <td>
                                                                        <button className="btn btn-primary" onClick={() => handlePayFine(f._id)} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>Clear</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Cadet Portal View */
                            <div className="container" style={{ paddingTop: '20px' }}>
                                <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left' }}>
                                    <h2>Cadet Dashboard File</h2>
                                    <p>Track your individual parade attendance, leaves exemptions, and outstanding fine ledgers.</p>
                                </div>

                                <div className="dashboard-grid">
                                    {/* Sidebar Cadet details card */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                        <div className="profile-card" style={{ padding: '25px' }}>
                                            <div className="profile-avatar"><i className="fa-solid fa-user-shield"></i></div>
                                            <h3 className="profile-name">{cadet?.name || 'Cadet Profile'}</h3>
                                            <div className="profile-rank" style={{ textTransform: 'uppercase' }}>
                                                {cadet?.rank} | {cadet?.squadron} Squadron
                                            </div>
                                            
                                            <div className="profile-details-list" style={{ textAlign: 'left', marginTop: '20px', fontSize: '0.85rem' }}>
                                                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                                    <strong>Regimental No</strong>: {cadet?.enrollmentNo}
                                                </div>
                                                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                                    <strong>Wing Division</strong>: {cadet?.wing} (1 DBN)
                                                </div>
                                                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                                    <strong>Enrollment Year</strong>: {cadet?.year}nd Year
                                                </div>
                                                <div style={{ padding: '8px 0' }}>
                                                    <strong>Cadet ID</strong>: {cadet?.cadetId}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Leave Application submit form */}
                                        <div className="exemption-box" style={{ textAlign: 'left' }}>
                                            <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '12px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: '700' }}>
                                                Request Parade Leave
                                            </h4>
                                            {leaveMsg && <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>{leaveMsg}</div>}
                                            <form onSubmit={handleLeaveRequest}>
                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Parade Date</label>
                                                    <input type="date" className="form-control" style={{ fontSize: '0.8rem', padding: '6px 10px' }} value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
                                                </div>
                                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Exemption Reason</label>
                                                    <input type="text" className="form-control" style={{ fontSize: '0.8rem', padding: '6px 10px' }} value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
                                                </div>
                                                <button type="submit" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                                                    Submit Leave
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Main Area dashboard statistics */}
                                    <div className="dashboard-main">
                                        <div className="metrics-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                                            <div className="attendance-metric-card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fines Due</div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--danger)', margin: '5px 0' }}>
                                                    ₹{fines.filter(f => f.status === 'Unpaid').reduce((acc, curr) => acc + curr.amount, 0)}
                                                </div>
                                            </div>
                                            <div className="attendance-metric-card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Parades Attended</div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', margin: '5px 0' }}>
                                                    {attendance.filter(a => a.status === 'Present').length} / {attendance.length || 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Attendance log lists */}
                                        <div className="dashboard-section" style={{ padding: '25px', marginBottom: '25px' }}>
                                            <h3 style={{ fontSize: '1.15rem', marginBottom: '15px' }}><i className="fa-solid fa-clipboard-user"></i> My Parade Register</h3>
                                            <table className="leaderboard-table" style={{ fontSize: '0.85rem' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Parade Date</th>
                                                        <th>Attendance Status</th>
                                                        <th>Verified By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attendance.map((a, idx) => (
                                                        <tr key={idx}>
                                                            <td>{a.date}</td>
                                                            <td><span className={`badge ${a.status === 'Present' ? 'badge-success' : a.status === 'Absent' ? 'badge-danger' : 'badge-warning'}`}>{a.status}</span></td>
                                                            <td>{a.markedBy}</td>
                                                        </tr>
                                                    ))}
                                                    {attendance.length === 0 && (
                                                        <tr>
                                                            <td colSpan="3" className="text-center" style={{ color: 'var(--text-muted)', padding: '15px 0' }}>No parade records found in database.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Unpaid fines and UPI scanner card */}
                                        <div className="dashboard-section" style={{ padding: '25px' }}>
                                            <h3 style={{ fontSize: '1.15rem', marginBottom: '15px' }}><i className="fa-solid fa-wallet"></i> Fine Ledger Statement</h3>
                                            <div className="fines-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
                                                <div>
                                                    <table className="leaderboard-table" style={{ fontSize: '0.85rem' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Date Generated</th>
                                                                <th>Absence Date</th>
                                                                <th>Amount Due</th>
                                                                <th>Status</th>
                                                                <th>Payment</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {fines.map(f => (
                                                                <tr key={f._id}>
                                                                    <td>{f.dateCreated}</td>
                                                                    <td>{f.dateCreated}</td>
                                                                    <td style={{ color: f.status === 'Unpaid' ? 'var(--danger)' : 'var(--success)', fontWeight: '700' }}>₹{f.amount}</td>
                                                                    <td><span className={`badge ${f.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>{f.status}</span></td>
                                                                    <td>
                                                                        {f.status === 'Unpaid' ? (
                                                                            <button className="btn btn-primary" onClick={() => handlePayFine(f._id)} style={{ padding: '3px 8px', fontSize: '0.75rem' }}>Pay Mock</button>
                                                                        ) : (
                                                                            <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Paid</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {fines.length === 0 && (
                                                                <tr>
                                                                    <td colSpan="5" className="text-center" style={{ color: 'var(--text-muted)', padding: '15px 0' }}>No outstanding absence fines recorded. Jai Hind!</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="upi-payment-box" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', backgroundColor: '#fcfcfc' }}>
                                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--primary)' }}>UPI Scan Payment</h4>
                                                    <div style={{ width: '130px', height: '130px', margin: '15px auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                                        <i className="fa-solid fa-qrcode" style={{ fontSize: '6rem', color: '#1a202c' }}></i>
                                                    </div>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scan using BHIM, GPAY, or Paytm to pay directly to 1 DBN NCC Unit treasury account.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {currentTab === 'settings' && user && (
                    <div className="view-section active">
                        <div className="container" style={{ paddingTop: '40px', maxWidth: '600px', paddingBottom: '40px' }}>
                            <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left' }}>
                                <h2>Account Security & Settings</h2>
                                <p>Update your email address or change your account login password below.</p>
                            </div>

                            <div className="profile-card" style={{ padding: '30px', textAlign: 'left' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.15rem', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', fontWeight: '700' }}>
                                    <i className="fa-solid fa-lock"></i> Update Credentials
                                </h3>

                                {settingsMsg && (
                                    <div className="alert alert-success" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>
                                        <i className="fa-solid fa-circle-check"></i> {settingsMsg}
                                    </div>
                                )}
                                {settingsError && (
                                    <div className="alert alert-danger" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>
                                        <i className="fa-solid fa-triangle-exclamation"></i> {settingsError}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateAccount}>
                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label className="form-label">Current Email Address</label>
                                        <input type="text" className="form-control" value={user.email} disabled style={{ backgroundColor: '#f0f4f8' }} />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label className="form-label">New Email Address (Optional)</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            placeholder="Leave blank to keep current email" 
                                            value={settingsEmail} 
                                            onChange={(e) => setSettingsEmail(e.target.value)} 
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label className="form-label">New Password (Optional)</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Leave blank to keep current password" 
                                            value={settingsPassword} 
                                            onChange={(e) => setSettingsPassword(e.target.value)} 
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                        <label className="form-label" style={{ color: 'var(--danger)', fontWeight: '700' }}>Current Password * (Required to save changes)</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Confirm your identity with current password" 
                                            value={settingsCurrentPassword} 
                                            onChange={(e) => setSettingsCurrentPassword(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {selectedViewCadet && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div className="profile-card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', padding: '30px', position: 'relative', textAlign: 'left', borderTop: '5px solid var(--saffron)' }}>
                            <button 
                                onClick={() => setSelectedViewCadet(null)} 
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                                <div style={{ width: '80px', height: '100px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: '#f0f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-user-shield" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
                                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '4px' }}>Profile</span>
                                </div>
                                <div>
                                    <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.75rem', padding: '4px 8px', textTransform: 'uppercase' }}>{selectedViewCadet.rank}</span>
                                    <h2 style={{ margin: '8px 0 4px 0', fontSize: '1.6rem', color: 'var(--navy-blue)', fontWeight: '700' }}>{selectedViewCadet.name}</h2>
                                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>DLI: <strong>{selectedViewCadet.enrollmentNo || selectedViewCadet.dliNo}</strong> | Squadron: <strong style={{ textTransform: 'uppercase' }}>{selectedViewCadet.squadron}</strong></p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                {/* Block 1: Basic & Academic */}
                                <div>
                                    <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Academic & College Details</h4>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Date of Birth</strong>: {selectedViewCadet.dob || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>College</strong>: {selectedViewCadet.college || 'DTU'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Course</strong>: {selectedViewCadet.course || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Branch</strong>: {selectedViewCadet.branch || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>College Roll No</strong>: {selectedViewCadet.collegeRollNo || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Cadet Year</strong>: Year {selectedViewCadet.year || 'N/A'} (Acad Year: {selectedViewCadet.academicYear || 'N/A'})</p>
                                </div>

                                {/* Block 2: Contacts */}
                                <div>
                                    <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Contact Information</h4>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Mobile No</strong>: {selectedViewCadet.contact || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Alt Mobile</strong>: {selectedViewCadet.altContact || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Mail ID</strong>: {selectedViewCadet.email || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Address</strong>: {selectedViewCadet.address || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                                         <strong>City/Pincode</strong>: {selectedViewCadet.city || 'N/A'} - {selectedViewCadet.pincode || 'N/A'} ({selectedViewCadet.residenceType || 'N/A'})
                                         {selectedViewCadet.residenceType === 'Hostel' && selectedViewCadet.hostelNo && ` | Hostel No: ${selectedViewCadet.hostelNo}`}
                                         {selectedViewCadet.residenceType === 'PG/Flat' && selectedViewCadet.pgLocation && ` | PG Loc: ${selectedViewCadet.pgLocation}`}
                                     </p>
                                </div>

                                {/* Block 3: Parents & Medical */}
                                <div>
                                    <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Parent's Details</h4>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Father's Name</strong>: {selectedViewCadet.fatherName || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Mother's Name</strong>: {selectedViewCadet.motherName || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Guardian's Name</strong>: {selectedViewCadet.guardianName || 'N/A'}</p>
                                </div>

                                <div>
                                    <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '5px', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '700' }}>Medical & Camps Details</h4>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Blood Group</strong>: <span style={{ color: 'var(--danger)', fontWeight: '700' }}>{selectedViewCadet.bloodGroup || 'N/A'}</span></p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Allergies</strong>: {selectedViewCadet.allergies || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Medical Conditions</strong>: {selectedViewCadet.medicalConditions || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Regular Medications</strong>: {selectedViewCadet.medications || 'N/A'}</p>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><strong>Camps Attended</strong>: {selectedViewCadet.campsAttended || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                {!selectedViewCadet.approved && (
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                                        onClick={() => {
                                            handleApproveCadet(selectedViewCadet._id);
                                            setSelectedViewCadet(null);
                                        }}
                                    >
                                        Approve Registration
                                    </button>
                                )}
                                <button className="btn btn-outline" onClick={() => setSelectedViewCadet(null)}>Close Profile</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="main-footer" style={{ marginTop: 'auto', backgroundColor: '#0e1d30', color: '#8898aa', padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container text-center" style={{ fontSize: '0.85rem' }}>
                    <p>© 2026 1 DBN NCC Unit, Delhi Technological University. All Rights Reserved.</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '5px', color: '#526071' }}>Building character, comradeship, and selfless service. Ekta aur Anushasan.</p>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
