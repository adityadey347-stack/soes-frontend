import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const ViewExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await adminAPI.getAllExams();
            setExams(response.data.data);
        } catch (err) {
            setError('Failed to fetch exams');
        }
        setLoading(false);
    };

    const handleDelete = async (examId, examTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${examTitle}"?\n\nThis will also delete all questions and results.`)) {
            return;
        }

        try {
            await adminAPI.deleteExam(examId);
            setExams(exams.filter((exam) => exam._id !== examId));
            alert('Exam deleted successfully');
        } catch (err) {
            alert('Failed to delete exam');
        }
    };

    const toggleActive = async (examId, currentStatus) => {
        try {
            await adminAPI.updateExam(examId, { isActive: !currentStatus });
            fetchExams(); // Refresh list
        } catch (err) {
            alert('Failed to update exam status');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loader">Loading exams...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>📚 Exam Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create, edit, and manage all your examinations</p>
                </div>
                <Link to="/admin/create-exam" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    ➕ Create New Exam
                </Link>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

            {exams.length === 0 ? (
                <div className="card glass">
                    <div className="card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📑</div>
                        <h3>No exams created yet</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 2rem' }}>
                            Start by creating your first exam. You can add questions and set rules later.
                        </p>
                        <Link to="/admin/create-exam" className="btn btn-primary">
                            Create Your First Exam 🚀
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                    {exams.map((exam) => (
                        <div key={exam._id} className="card glass" style={{ border: 'none', display: 'flex', flexDirection: 'column' }}>
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <h3 className="card-title" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{exam.title}</h3>
                                    <span
                                        className="badge"
                                        style={{
                                            background: exam.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                            color: exam.isActive ? 'var(--secondary)' : 'var(--text-muted)',
                                            border: '1px solid currentColor',
                                            padding: '0.4rem 0.8rem'
                                        }}
                                    >
                                        {exam.isActive ? '● Active' : '○ Inactive'}
                                    </span>
                                </div>
                                {exam.description && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        {exam.description}
                                    </p>
                                )}
                            </div>

                            <div className="card-body" style={{ padding: '2rem', flex: 1 }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1.5rem',
                                    background: 'rgba(99, 102, 241, 0.03)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '2rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>⏱️</span>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                                            <div style={{ fontWeight: '700' }}>{exam.duration} mins</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>📊</span>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Marks</div>
                                            <div style={{ fontWeight: '700' }}>{exam.totalMarks}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>✅</span>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passing</div>
                                            <div style={{ fontWeight: '700' }}>{exam.passingMarks}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>❓</span>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions</div>
                                            <div style={{ fontWeight: '700' }}>{exam.questionCount || 0}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <Link to={`/admin/exam/${exam._id}/edit`} className="btn btn-secondary btn-sm" style={{ flex: 1, minWidth: '80px' }}>
                                        ✏️ Edit
                                    </Link>
                                    <Link to={`/admin/exam/${exam._id}/add-questions`} className="btn btn-primary btn-sm" style={{ flex: 1, minWidth: '120px' }}>
                                        ➕ Questions
                                    </Link>
                                    <Link to={`/admin/exam/${exam._id}/results`} className="btn btn-secondary btn-sm" style={{ flex: 1, minWidth: '120px' }}>
                                        📈 Results
                                    </Link>
                                    <button
                                        onClick={() => toggleActive(exam._id, exam.isActive)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ flex: 1, minWidth: '100px' }}
                                    >
                                        {exam.isActive ? '🔒 Deactivate' : '🔓 Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exam._id, exam.title)}
                                        className="btn btn-danger btn-sm"
                                        style={{ flex: 1, minWidth: '80px' }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                padding: '1rem 2rem',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                background: 'rgba(0,0,0,0.01)',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                                <span>ID: {exam._id.substring(0, 8)}...</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewExams;
