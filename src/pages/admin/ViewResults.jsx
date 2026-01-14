import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const ViewResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, passed, failed

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await adminAPI.getAllResults();
            setResults(response.data.data);
        } catch (err) {
            setError('Failed to fetch results');
        }
        setLoading(false);
    };

    const filteredResults = results.filter((result) => {
        if (filter === 'passed') return result.passed;
        if (filter === 'failed') return !result.passed;
        return true;
    });

    const stats = {
        total: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        avgPercentage: results.length > 0
            ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2)
            : 0,
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loader">Loading results...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>📊 Student Results</h1>
                <p style={{ color: 'var(--text-muted)' }}>Monitor student performance across all examinations</p>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

            {/* Stats Cards */}
            <div className="grid grid-3" style={{ marginBottom: '3rem', gap: '1.5rem' }}>
                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>
                            {stats.total}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Total Submissions</div>
                    </div>
                </div>

                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: '1' }}>
                            {stats.passed}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Passed Students</div>
                    </div>
                </div>

                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❌</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger)', lineHeight: '1' }}>
                            {stats.failed}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem' }}>Failed Students</div>
                    </div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '100px' }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('passed')}
                    className={`btn btn-sm ${filter === 'passed' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '100px' }}
                >
                    Passed
                </button>
                <button
                    onClick={() => setFilter('failed')}
                    className={`btn btn-sm ${filter === 'failed' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '100px' }}
                >
                    Failed
                </button>
            </div>

            {/* Results Table */}
            {filteredResults.length === 0 ? (
                <div className="card glass">
                    <div className="card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                        <h3>No results found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {filter === 'all'
                                ? 'No students have attempted any exams yet'
                                : `No ${filter} results match your filter`}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card glass" style={{ border: 'none', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(99, 102, 241, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--primary)', fontWeight: '700' }}>Student</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--primary)', fontWeight: '700' }}>Exam</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--primary)', fontWeight: '700' }}>Score</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--primary)', fontWeight: '700' }}>Percentage</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--primary)', fontWeight: '700' }}>Status</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--primary)', fontWeight: '700' }}>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((result) => (
                                    <tr key={result._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'var(--transition)' }} className="table-row-hover">
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{result.studentId?.name || 'N/A'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {result.studentId?.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{result.examId?.title || 'N/A'}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                            <div style={{ fontWeight: '700' }}>
                                                {result.score} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>/ {result.totalMarks}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                            <div
                                                style={{
                                                    fontWeight: '800',
                                                    fontSize: '1.1rem',
                                                    color:
                                                        result.percentage >= 80
                                                            ? 'var(--secondary)'
                                                            : result.percentage >= 50
                                                                ? 'var(--warning)'
                                                                : 'var(--danger)',
                                                }}
                                            >
                                                {result.percentage}%
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: result.passed ? 'var(--secondary)' : 'var(--danger)',
                                                    border: '1px solid currentColor',
                                                    padding: '0.3rem 0.75rem',
                                                    fontWeight: '700'
                                                }}
                                            >
                                                {result.passed ? 'PASS' : 'FAIL'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>📅</span> {new Date(result.submittedAt).toLocaleDateString()}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                <span>⏱️</span> {new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewResults;
