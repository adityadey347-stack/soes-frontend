import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const ResultDetails = () => {
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResultDetails();
    }, [resultId]);

    const fetchResultDetails = async () => {
        try {
            const response = await studentAPI.getResultById(resultId);
            setResult(response.data.data);
        } catch (err) {
            setError('Failed to fetch result details');
        }
        setLoading(false);
    };

    if (loading) return <div className="container">Loading details...</div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
    if (!result) return <div className="container">Result not found</div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>📝 Exam Review</h1>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>{result.examId.title}</h2>

                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    background: 'rgba(255,255,255,0.5)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{result.score} / {result.totalMarks}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📈</span>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Percentage</div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: '800',
                                color: result.passed ? 'var(--secondary)' : 'var(--danger)'
                            }}>{result.percentage}%</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🏆</span>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                            <span className="badge" style={{
                                background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: result.passed ? 'var(--secondary)' : 'var(--danger)',
                                border: '1px solid currentColor',
                                fontWeight: '700'
                            }}>
                                {result.passed ? 'PASSED' : 'FAILED'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {result.answers.map((ans, index) => (
                    <div key={index} className="card glass" style={{
                        borderLeft: `6px solid ${ans.isCorrect ? 'var(--secondary)' : 'var(--danger)'}`,
                        overflow: 'hidden'
                    }}>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', lineHeight: '1.4', flex: 1 }}>
                                    <span style={{ color: 'var(--primary)', marginRight: '0.75rem' }}>Q{index + 1}.</span>
                                    {ans.questionId.questionText}
                                </h3>
                                <div className="badge" style={{
                                    background: ans.isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                    color: ans.isCorrect ? 'var(--secondary)' : 'var(--danger)',
                                    whiteSpace: 'nowrap',
                                    marginLeft: '1.5rem'
                                }}>
                                    {ans.marksObtained} / {ans.questionId.marks || 1} Marks
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {ans.questionId.options.map((opt, optIndex) => {
                                    const isSelected = optIndex === ans.selectedAnswer;
                                    const isCorrect = optIndex === ans.questionId.correctAnswer;

                                    let bg = 'var(--bg-main)';
                                    let border = '1px solid var(--border)';
                                    let icon = null;
                                    let textColor = 'var(--text-main)';

                                    if (isCorrect) {
                                        bg = 'rgba(16, 185, 129, 0.08)';
                                        border = '1px solid var(--secondary)';
                                        icon = '✅';
                                        textColor = 'var(--secondary)';
                                    } else if (isSelected && !isCorrect) {
                                        bg = 'rgba(239, 68, 68, 0.08)';
                                        border = '1px solid var(--danger)';
                                        icon = '❌';
                                        textColor = 'var(--danger)';
                                    }

                                    return (
                                        <div key={optIndex} style={{
                                            padding: '1rem 1.25rem',
                                            borderRadius: 'var(--radius-md)',
                                            background: bg,
                                            border: border,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'var(--transition)'
                                        }}>
                                            <span style={{ color: textColor, fontWeight: (isSelected || isCorrect) ? '600' : '400' }}>
                                                <span style={{ marginRight: '0.75rem', opacity: 0.6 }}>
                                                    {String.fromCharCode(65 + optIndex)}.
                                                </span>
                                                {opt}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {isSelected && <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', opacity: 0.6 }}>Your Choice</span>}
                                                {icon && <span>{icon}</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!ans.isCorrect && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: 'rgba(99, 102, 241, 0.03)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.9rem',
                                    border: '1px dashed var(--primary)',
                                    color: 'var(--primary)'
                                }}>
                                    <strong>💡 Correct Answer:</strong> Option {String.fromCharCode(65 + ans.questionId.correctAnswer)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                <Link to="/student/results" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                    Back to All Results 📊
                </Link>
            </div>
        </div>
    );
};

export default ResultDetails;
