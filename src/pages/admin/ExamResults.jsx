import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const ExamResults = () => {
    const { examId } = useParams();
    const [results, setResults] = useState([]);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExamResults();
    }, [examId]);

    const fetchExamResults = async () => {
        try {
            const response = await adminAPI.getExamResults(examId);
            setExam(response.data.exam);
            setResults(response.data.data);
        } catch (err) {
            setError('Failed to fetch exam results');
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loader">Loading results...</div>
            </div>
        );
    }

    const stats = {
        total: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        avgScore: results.length > 0
            ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(2)
            : 0,
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>📊 Exam Results</h1>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>{exam?.title}</h2>
                <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    gap: '2rem',
                    background: 'rgba(255,255,255,0.5)',
                    padding: '1rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📊 Total Marks: {exam?.totalMarks}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Passing Marks: {exam?.passingMarks || 'N/A'}</span>
                </div>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: '3rem', gap: '1.5rem' }}>
                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>
                            {stats.total}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Total Attempts</div>
                    </div>
                </div>
                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: '1' }}>
                            {stats.passed}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Passed</div>
                    </div>
                </div>
                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger)', lineHeight: '1' }}>
                            {stats.failed}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Failed</div>
                    </div>
                </div>
            </div>

            {/* Results List */}
            {results.length === 0 ? (
                <div className="card glass">
                    <div className="card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                        <h3>No attempts yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            No students have attempted this exam yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                    {results.map((result) => (
                        <div key={result._id} className="card glass" style={{ border: 'none' }}>
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 className="card-title" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{result.studentId?.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            {result.studentId?.email}
                                        </p>
                                    </div>
                                    <span
                                        className="badge"
                                        style={{
                                            background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: result.passed ? 'var(--secondary)' : 'var(--danger)',
                                            border: '1px solid currentColor',
                                            padding: '0.4rem 0.8rem',
                                            fontWeight: '700'
                                        }}
                                    >
                                        {result.passed ? 'PASS' : 'FAIL'}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body" style={{ padding: '2rem' }}>
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

                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    justifyContent: 'flex-end'
                                }}>
                                    <span>📅</span> {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExamResults;
