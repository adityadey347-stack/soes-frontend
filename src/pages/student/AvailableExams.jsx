import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const AvailableExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await studentAPI.getAvailableExams();
            setExams(response.data.data);
        } catch (err) {
            setError('Failed to fetch available exams');
        }
        setLoading(false);
    };

    const handleStartExam = (examId) => {
        if (window.confirm('Are you ready to start the exam? The timer will start immediately.')) {
            navigate(`/student/exam/${examId}/take`);
        }
    };

    if (loading) {
        return <div className="container">Loading exams...</div>;
    }

    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>📚 Available Exams</h1>
                <p style={{ color: 'var(--text-muted)' }}>Test your knowledge and track your progress</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {exams.length === 0 ? (
                <div className="card glass">
                    <div className="card-body" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                        <h3>No exams available</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto' }}>
                            There are no active exams available for you to take at the moment. Check back later!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                    {exams.map((exam) => (
                        <div key={exam._id} className="card glass">
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <h3 className="card-title" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{exam.title}</h3>
                                {exam.description && (
                                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                                        {exam.description}
                                    </p>
                                )}
                            </div>

                            <div className="card-body">
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1.5rem',
                                    marginBottom: '2rem',
                                    background: 'rgba(99, 102, 241, 0.03)',
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                                            <div style={{ fontWeight: '600' }}>{exam.duration} mins</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>❓</span>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions</div>
                                            <div style={{ fontWeight: '600' }}>{exam.questionCount}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Marks</div>
                                            <div style={{ fontWeight: '600' }}>{exam.totalMarks}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passing</div>
                                            <div style={{ fontWeight: '600' }}>{exam.passingMarks}</div>
                                        </div>
                                    </div>
                                </div>

                                {exam.isAttempted ? (
                                    <button className="btn btn-secondary btn-block" disabled style={{ opacity: 0.7 }}>
                                        <span style={{ marginRight: '0.5rem' }}>✔️</span> Already Attempted
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStartExam(exam._id)}
                                        className="btn btn-primary btn-block"
                                    >
                                        Start Exam <span style={{ marginLeft: '0.5rem' }}>🚀</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableExams;
