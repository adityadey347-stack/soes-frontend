import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const MyResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await studentAPI.getMyResults();
            setResults(response.data.data);
        } catch (err) {
            setError('Failed to fetch your results');
        }
        setLoading(false);
    };

    if (loading) return <div className="container">Loading results...</div>;

    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>📊 My Exam Results</h1>
                <p style={{ color: 'var(--text-muted)' }}>Review your performance and track your growth</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {results.length === 0 ? (
                <div className="card glass">
                    <div className="card-body" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
                        <h3>No results yet</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto' }}>
                            You haven't taken any exams yet. Start your first exam to see your results here!
                        </p>
                        <Link to="/student/exams" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            Browse Exams
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                    {results.map((result) => (
                        <div key={result._id} className="card glass">
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <h3 className="card-title" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                                        {result.examId?.title || 'Unknown Exam'}
                                    </h3>
                                    <span
                                        className="badge"
                                        style={{
                                            background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: result.passed ? 'var(--secondary)' : 'var(--danger)',
                                            border: '1px solid currentColor',
                                            padding: '0.4rem 0.8rem'
                                        }}
                                    >
                                        {result.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📅</span> {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div className="card-body">
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1.5rem',
                                    background: 'rgba(99, 102, 241, 0.03)',
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Score</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {result.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ {result.totalMarks}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Percentage</div>
                                        <div
                                            style={{
                                                fontSize: '1.5rem',
                                                fontWeight: '800',
                                                color: result.passed ? 'var(--secondary)' : 'var(--danger)',
                                            }}
                                        >
                                            {result.percentage}%
                                        </div>
                                    </div>
                                </div>

                                <Link to={`/student/result/${result._id}`} className="btn btn-secondary btn-block">
                                    View Detailed Report 📄
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyResults;
