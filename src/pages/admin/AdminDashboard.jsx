import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateExam from './CreateExam';
import EditExam from './EditExam';
import AddQuestions from './AddQuestions';
import ViewExams from './ViewExams';
import ViewResults from './ViewResults';
import ExamResults from './ExamResults';
import Settings from './Settings';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="container">
                        <div className="dashboard-header">
                            <h1>👨‍💼 Admin Dashboard</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{user?.name}</span>!</p>
                        </div>

                        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">📝 Create Exam</h3>
                                </div>
                                <div className="card-body">
                                    <p>Design new exams and add challenging questions</p>
                                    <Link to="/admin/create-exam" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        Create New Exam
                                    </Link>
                                </div>
                            </div>

                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">📚 View Exams</h3>
                                </div>
                                <div className="card-body">
                                    <p>Manage and monitor all your existing exams</p>
                                    <Link to="/admin/exams" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        View All Exams
                                    </Link>
                                </div>
                            </div>

                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">📊 Student Results</h3>
                                </div>
                                <div className="card-body">
                                    <p>Analyze student performance and detailed results</p>
                                    <Link to="/admin/results" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        View Results
                                    </Link>
                                </div>
                            </div>

                            <div className="card glass">
                                <div className="card-header">
                                    <h3 className="card-title">⚙️ Settings</h3>
                                </div>
                                <div className="card-body">
                                    <p>Configure your profile and account security</p>
                                    <Link to="/admin/settings" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                        Settings
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/exam/:examId/edit" element={<EditExam />} />
            <Route path="/exam/:examId/add-questions" element={<AddQuestions />} />
            <Route path="/exams" element={<ViewExams />} />
            <Route path="/results" element={<ViewResults />} />
            <Route path="/exam/:examId/results" element={<ExamResults />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default AdminDashboard;
