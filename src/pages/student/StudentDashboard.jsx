import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AvailableExams from './AvailableExams';
import TakeExam from './TakeExam';
import MyResults from './MyResults';
import ResultDetails from './ResultDetails';

import Settings from './Settings';

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="container">
                        <div className="dashboard-header">
                            <h1>👨‍🎓 Student Dashboard</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>{user?.name}</span>!</p>
                        </div>

                        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">📚 Available Exams</h3>
                                </div>
                                <div className="card-body">
                                    <p>Explore and attempt exams to test your knowledge</p>
                                    <Link to="/student/exams" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        View Exams
                                    </Link>
                                </div>
                            </div>

                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">📊 My Results</h3>
                                </div>
                                <div className="card-body">
                                    <p>Track your progress and review your performance</p>
                                    <Link to="/student/results" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        View Results
                                    </Link>
                                </div>
                            </div>

                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">⚙️ Settings</h3>
                                </div>
                                <div className="card-body">
                                    <p>Manage your profile and account security</p>
                                    <Link to="/student/settings" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        Settings
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
            <Route path="/exams" element={<AvailableExams />} />
            <Route path="/exam/:examId/take" element={<TakeExam />} />
            <Route path="/results" element={<MyResults />} />
            <Route path="/result/:resultId" element={<ResultDetails />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default StudentDashboard;
