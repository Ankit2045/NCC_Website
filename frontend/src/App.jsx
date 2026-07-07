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
    const [regRank, setRegRank] = useState('Cdt');
    const [regYear, setRegYear] = useState('2');
    const [regContact, setRegContact] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regMsg, setRegMsg] = useState('');
    const [regErrorMsg, setRegErrorMsg] = useState('');

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

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegMsg('');
        setRegErrorMsg('');

        if (!regEmail.endsWith('@dtuncc.in')) {
            setRegErrorMsg('Registration is restricted to official @dtuncc.in email domains.');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: regName,
                    enrollmentNo: regEnrollment,
                    squadron: regSquadron,
                    rank: regRank,
                    wing: 'Army',
                    year: parseInt(regYear),
                    contact: regContact,
                    email: regEmail,
                    password: regPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                setRegMsg(`Registration successful! You can now log in using your official email.`);
                setRegName('');
                setRegEnrollment('');
                setRegContact('');
                setRegEmail('');
                setRegPassword('');
            } else {
                setRegErrorMsg(data.message || 'Registration failed');
            }
        } catch (err) {
            setRegErrorMsg('Error contacting backend server.');
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
            email: cadetEmail
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
                <div className="logo-container" onClick={() => setCurrentTab('home')} style={{ cursor: 'pointer' }}>
                    <div className="logo-text">
                        <h1>1 DBN NCC</h1>
                        <p>Delhi Technological University</p>
                    </div>
                </div>
                
                <nav className="main-nav">
                    <ul className="nav-links">
                        <li><a href="#" className={`nav-link ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')}>Home</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'about' ? 'active' : ''}`} onClick={() => setCurrentTab('about')}>About Us</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'camps' ? 'active' : ''}`} onClick={() => setCurrentTab('camps')}>Camps</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setCurrentTab('leaderboard')}>Leaderboard</a></li>
                        <li><a href="#" className={`nav-link ${currentTab === 'contact' ? 'active' : ''}`} onClick={() => setCurrentTab('contact')}>Notices & Help</a></li>
                        
                        {user && (
                            <li>
                                <a 
                                    href="#" 
                                    className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`} 
                                    onClick={() => setCurrentTab('dashboard')}
                                >
                                    {user.role === 'admin' ? 'Admin Portal' : 'My Dashboard'}
                                </a>
                            </li>
                        )}
                        
                        <li>
                            {user ? (
                                <button className="btn btn-outline" onClick={() => { logout(); setCurrentTab('home'); }} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout ({user.role === 'admin' ? 'ANO/CQMS' : (cadet?.name || 'Cadet')})
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={() => { setLoginError(''); setCurrentTab('login'); }} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
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
                                <div className="hero-tagline">1 Delhi Battalion (1 DBN) NCC Subunit</div>
                                <h1 className="hero-title">DTU Cadet Portal</h1>
                                <p className="hero-desc">Building character, comradeship, discipline, a secular outlook, the spirit of adventure, and ideals of selfless service among the youth of the Delhi Technological University detachment.</p>
                                <div className="hero-buttons">
                                    <button className="btn btn-primary" onClick={() => setCurrentTab('camps')}><i class="fa-solid fa-tent"></i> Explore Camps</button>
                                    <button className="btn btn-outline" onClick={() => setCurrentTab('leaderboard')}><i class="fa-solid fa-trophy"></i> Championship Standings</button>
                                </div>
                            </div>
                        </div>

                        <div className="stats-section">
                            <div className="container">
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-number">150+</div>
                                        <div className="stat-label">Enrolled Cadets</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-number">4</div>
                                        <div className="stat-label">Squadrons</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-number">8+</div>
                                        <div className="stat-label">Annual Camps</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-number">2026-27</div>
                                        <div className="stat-label">Championship Year</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container home-row">
                            <div className="motto-box">
                                <div className="motto-title">NCC Motto</div>
                                <div className="motto-text">"Unity and Discipline" (Ekta aur Anushasan)</div>
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
                                <h2>Unit Gallery</h2>
                                <p>Moments of training, camps, and achievements of 1 DBN DTU Cadets</p>
                            </div>
                            
                            <div className="gallery-grid">
                                <div className="gallery-card">
                                    <img src="gallery/drill.jpg" alt="Parade Drill Training" />
                                    <div className="gallery-overlay">
                                        <div className="gallery-title">Parade Drill Training</div>
                                        <div className="gallery-desc">DTU cadets practicing synchronized platoon drill movements under 1 DBN.</div>
                                    </div>
                                </div>
                                
                                <div className="gallery-card">
                                    <div style={{ height: '100%', width: '100%', background: 'linear-gradient(135deg, var(--army-red) 0%, var(--primary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column', padding: '20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                        <i className="fa-solid fa-tent" style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--secondary)' }}></i>
                                        <h4 style={{ marginBottom: '8px', fontWeight: '700' }}>Combined Annual Training Camp</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: '0.9' }}>10 days of rigorous physical training, weapon inspections, and cultural competitions at the annual CATC.</p>
                                    </div>
                                </div>
                                
                                <div className="gallery-card">
                                    <div style={{ height: '100%', width: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--navy-blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column', padding: '20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                        <i className="fa-solid fa-bullseye" style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--secondary)' }}></i>
                                        <h4 style={{ marginBottom: '8px', fontWeight: '700' }}>Weapon Firing Practice</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: '0.9' }}>Firing simulation and range inspection training sessions at Delhi Cantonment range ground.</p>
                                    </div>
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

                        {/* Self-Registration Form Section */}
                        <div className="container home-row">
                            <div className="profile-card" style={{ padding: '30px', textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                                    <i className="fa-solid fa-user-plus"></i> Cadet Self-Registration Portal
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                    If you are an active 1 DBN cadet at DTU, register your profile below. Self-registration is restricted to official email addresses ending with <strong>`@dtuncc.in`</strong>.
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
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                                            <input type="text" className="form-control" placeholder="E.g., Ankit Singh" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Regimental No *</label>
                                            <input type="text" className="form-control" placeholder="E.g., DEL/SD/24/4831" value={regEnrollment} onChange={(e) => setRegEnrollment(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Squadron Platoon *</label>
                                            <select className="form-control" value={regSquadron} onChange={(e) => setRegSquadron(e.target.value)} required>
                                                <option value="alpha">Alpha</option>
                                                <option value="bravo">Bravo</option>
                                                <option value="charlie">Charlie</option>
                                                <option value="delta">Delta</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Rank *</label>
                                            <select className="form-control" value={regRank} onChange={(e) => setRegRank(e.target.value)} required>
                                                <option value="Cdt">Cadet (Cdt)</option>
                                                <option value="Lcp">Lance Corporal (Lcp)</option>
                                                <option value="Cpl">Corporal (Cpl)</option>
                                                <option value="Sgt">Sergeant (Sgt)</option>
                                                <option value="JUO">Junior Under Officer (JUO)</option>
                                                <option value="SUO">Senior Under Officer (SUO)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Cadet Year *</label>
                                            <select className="form-control" value={regYear} onChange={(e) => setRegYear(e.target.value)} required>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Contact Number *</label>
                                            <input type="text" className="form-control" placeholder="10-digit phone number" value={regContact} onChange={(e) => setRegContact(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Official Email (@dtuncc.in) *</label>
                                            <input type="email" className="form-control" placeholder="E.g., name@dtuncc.in" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Choose Password *</label>
                                            <input type="password" className="form-control" placeholder="Minimum 6 characters" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '12px' }}>
                                        <i className="fa-solid fa-user-check"></i> Register Profile
                                    </button>
                                </form>
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
                                <h2>About DTU NCC Subunit</h2>
                                <p>Developing disciplined citizens and leaders of tomorrow</p>
                            </div>
                            
                            <div className="about-intro-grid">
                                <div>
                                    <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text)', marginBottom: '15px' }}>
                                        The National Cadet Corps Subunit at Delhi Technological University (DTU) is an active part of **1 Delhi Battalion (1 DBN) NCC**. The unit fosters leadership qualities, national cohesion, discipline, and a strong sense of service.
                                    </p>
                                    <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
                                        Through military drills, weapons education, firing ranges, physical endurance maps, and leadership camps, cadets are trained to handle challenging environments. The Subunit serves as a gateway for cadets aspiring to serve in the Indian Armed Forces.
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
                                    <div className="timeline-item left">
                                        <div className="timeline-content">
                                            <h4>Enrollment & Selection</h4>
                                            <p>Rigorous physical selection, running, and interviews are conducted in August for the incoming batch.</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item right">
                                        <div className="timeline-content">
                                            <h4>Weekly Parades & Weaponry</h4>
                                            <p>Parades are held every Saturday focusing on squad drill movements, weapon handling (INSAS/0.22 Delux), and military theory.</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item left">
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
                                <div className="camp-card">
                                    <div className="camp-tag tag-army">National Level</div>
                                    <h3 style={{ marginTop: '10px' }}>Republic Day Camp (RDC)</h3>
                                    <p style={{ fontSize: '0.88rem', margin: '10px 0' }}>The pinnacle camp held at Cariappa Parade Ground, Delhi Cantonment. Cadets are selected to represent the Delhi Directorate in guard of honour and PM rally.</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span><i className="fa-solid fa-calendar"></i> January (Annual)</span>
                                        <span><i className="fa-solid fa-map-location-dot"></i> New Delhi</span>
                                    </div>
                                </div>

                                <div className="camp-card">
                                    <div className="camp-tag tag-army">Adventure</div>
                                    <h3 style={{ marginTop: '10px' }}>Thal Sainik Camp (TSC)</h3>
                                    <p style={{ fontSize: '0.88rem', margin: '10px 0' }}>Specialized military camp focusing on map reading, obstacle clearance courses, health and hygiene, and rifle shooting matches.</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span><i className="fa-solid fa-calendar"></i> Sept-Oct</span>
                                        <span><i className="fa-solid fa-map-location-dot"></i> DG NCC Delhi</span>
                                    </div>
                                </div>

                                <div className="camp-card">
                                    <div className="camp-tag tag-navy">Annual Compulsory</div>
                                    <h3 style={{ marginTop: '10px' }}>Combined Annual Training Camp (CATC)</h3>
                                    <p style={{ fontSize: '0.88rem', margin: '10px 0' }}>Mandatory 10-day camp for second and third-year cadets. Required for eligibility to appear for NCC 'B' and 'C' Certificate exams.</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span><i className="fa-solid fa-calendar"></i> Variable Dates</span>
                                        <span><i className="fa-solid fa-map-location-dot"></i> Local Battalion Ground</span>
                                    </div>
                                </div>
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
                                    <h3 style={{ marginBottom: '20px' }}><i className="fa-solid fa-bullhorn"></i> Official Subunit Bulletin</h3>
                                    <div className="announcements-feed">
                                        {announcements.map((n, i) => (
                                            <div className="announcement-item" key={i} style={{ marginBottom: '20px' }}>
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
                                    <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}><i className="fa-solid fa-building-shield"></i> ANO Subunit Office</h3>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}><strong>Associate NCC Officer (ANO)</strong>: Lt. Dr. R.S. Kovind</p>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}><strong>Office Location</strong>: Room 104, Gymnasium Building, DTU East Campus</p>
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
                            <div className="login-card">
                                <h3 className="login-title">1 DBN Cadet Login</h3>
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
                                </form>

                                <div style={{ marginTop: '20px', borderTop: '1px dashed var(--border)', paddingTop: '15px' }}>
                                    <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        Official Seed Account:
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                        <span><strong>User</strong>: admin@dtuncc.in</span>
                                        <span><strong>Pass</strong>: admin123</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. Cadet / Admin Portal View */}
                {currentTab === 'dashboard' && user && (
                    <div className="view-section active">
                        {user.role === 'admin' ? (
                            /* Admin Management View */
                            <div className="container" style={{ paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
                                    <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
                                        <h2>Admin Management Dashboard</h2>
                                        <p>Welcome, {user.email}. Manage 1 DBN unit records, database directories, and leave permits.</p>
                                    </div>
                                    <button className="btn btn-outline" onClick={handleResetDatabase} style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.8rem', padding: '8px 16px' }}>
                                        <i className="fa-solid fa-triangle-exclamation"></i> Reset Database
                                    </button>
                                </div>

                                <div className="dashboard-grid">
                                    {/* Sidebar Simulators */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
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

                                        {/* Cadet CRUD Directory */}
                                        <div className="dashboard-section" style={{ padding: '25px' }}>
                                            <h3 style={{ fontSize: '1.15rem', marginBottom: '15px', fontWeight: '700' }}><i className="fa-solid fa-address-book"></i> Active Cadet Directory</h3>
                                            <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto' }}>
                                                <table className="leaderboard-table" style={{ minWidth: '100%', fontSize: '0.82rem' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>ID</th>
                                                            <th>Regt No</th>
                                                            <th>Squadron</th>
                                                            <th>Rank</th>
                                                            <th>Contact</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cadets.map(c => (
                                                            <tr key={c._id}>
                                                                <td><strong>{c.name}</strong></td>
                                                                <td>{c.cadetId}</td>
                                                                <td>{c.enrollmentNo}</td>
                                                                <td style={{ textTransform: 'uppercase' }}>{c.squadron}</td>
                                                                <td>{c.rank}</td>
                                                                <td>{c.contact}</td>
                                                                <td>
                                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                                        <button className="btn btn-outline" onClick={() => handleEditClick(c)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}><i className="fa-solid fa-pen"></i></button>
                                                                        <button className="btn btn-outline" onClick={() => handleDeleteClick(c._id)} style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}><i className="fa-solid fa-trash"></i></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {cadets.length === 0 && (
                                                            <tr>
                                                                <td colSpan="7" className="text-center" style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No cadets enrolled in unit database yet.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Cadet CRUD form */}
                                            <div id="cadet-form-section" style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                                                <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '15px', fontWeight: '700' }}>
                                                    <i className="fa-solid fa-user-pen"></i> {editingCadetId ? 'Update Cadet Record' : 'Enroll New Cadet'}
                                                </h4>
                                                {adminCadetMsg && <div className="alert alert-success" style={{ marginBottom: '15px', fontSize: '0.85rem' }}>{adminCadetMsg}</div>}
                                                <form onSubmit={handleCadetSubmit}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                                        <div className="form-group">
                                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                                                            <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetName} onChange={(e) => setCadetName(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Regimental No *</label>
                                                            <input type="text" className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetEnrollment} onChange={(e) => setCadetEnrollment(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Squadron *</label>
                                                            <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetSquadron} onChange={(e) => setCadetSquadron(e.target.value)} required>
                                                                <option value="alpha">Alpha</option>
                                                                <option value="bravo">Bravo</option>
                                                                <option value="charlie">Charlie</option>
                                                                <option value="delta">Delta</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Rank *</label>
                                                            <select className="form-control" style={{ fontSize: '0.82rem', padding: '8px 12px' }} value={cadetRank} onChange={(e) => setCadetRank(e.target.value)} required>
                                                                <option value="Cdt">Cadet (Cdt)</option>
                                                                <option value="Lcp">Lance Corporal (Lcp)</option>
                                                                <option value="Cpl">Corporal (Cpl)</option>
                                                                <option value="Sgt">Sergeant (Sgt)</option>
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
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                                        <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                                                            <i className="fa-solid fa-floppy-disk"></i> {editingCadetId ? 'Save Updates' : 'Enroll Cadet'}
                                                        </button>
                                                        {editingCadetId && (
                                                            <button type="button" className="btn btn-outline" onClick={() => { setEditingCadetId(null); setCadetName(''); setCadetEnrollment(''); setCadetContact(''); setCadetEmail(''); }} style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </form>
                                            </div>
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
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scan using BHIM, GPAY, or Paytm to pay directly to 1 DBN NCC Subunit treasury account.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="main-footer" style={{ marginTop: 'auto', backgroundColor: '#0e1d30', color: '#8898aa', padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container text-center" style={{ fontSize: '0.85rem' }}>
                    <p>© 2026 1 DBN NCC Subunit, Delhi Technological University. All Rights Reserved.</p>
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
