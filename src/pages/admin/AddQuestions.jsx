import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const AddQuestions = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            marks: 1,
        },
    ]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExam();
    }, [examId]);

    const fetchExam = async () => {
        try {
            const response = await adminAPI.getExamById(examId);
            setExam(response.data.data.exam);
        } catch (err) {
            setError('Failed to fetch exam details');
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                marks: 1,
            },
        ]);
    };

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) {
                setError(`Question ${i + 1}: Question text is required`);
                return;
            }
            if (q.options.some((opt) => !opt.trim())) {
                setError(`Question ${i + 1}: All options must be filled`);
                return;
            }
        }

        setLoading(true);

        try {
            await adminAPI.addQuestions(examId, { questions });
            setSuccess(`${questions.length} questions added successfully!`);

            setTimeout(() => {
                navigate('/admin/exams');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add questions');
        }

        setLoading(false);
    };

    if (!exam) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="dashboard-header glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>❓ Add Questions</h1>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>{exam.title}</h2>
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
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⏱️ {exam.duration} mins</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📊 {exam.totalMarks} Total Marks</span>
                    </div>
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}
                {success && <div className="alert alert-success" style={{ marginBottom: '2rem' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="card glass" style={{ border: 'none' }}>
                                <div className="card-header" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(99, 102, 241, 0.03)',
                                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                                        <span style={{ opacity: 0.6, marginRight: '0.5rem' }}>#</span>Question {qIndex + 1}
                                    </h3>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="btn btn-danger btn-sm"
                                            style={{ padding: '0.4rem 0.8rem' }}
                                        >
                                            🗑️ Remove
                                        </button>
                                    )}
                                </div>

                                <div className="card-body" style={{ padding: '2rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '700', marginBottom: '0.75rem', display: 'block' }}>Question Text *</label>
                                        <textarea
                                            value={question.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                            placeholder="Enter the question clearly..."
                                            rows="3"
                                            required
                                            style={{ padding: '1rem', fontSize: '1.1rem' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ fontWeight: '700', marginBottom: '1rem', display: 'block' }}>Options & Correct Answer *</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {question.options.map((option, optIndex) => (
                                                <div key={optIndex} style={{
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    alignItems: 'center',
                                                    background: question.correctAnswer === optIndex ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                    padding: '0.5rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: question.correctAnswer === optIndex ? '1px solid var(--secondary)' : '1px solid transparent',
                                                    transition: 'var(--transition)'
                                                }}>
                                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={question.correctAnswer === optIndex}
                                                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                                                            title="Mark as correct answer"
                                                            style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: 'var(--secondary)' }}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                                        required
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem 1rem',
                                                            border: '1px solid var(--border)',
                                                            background: 'white'
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>💡</span> Select the radio button next to the correct answer.
                                        </p>
                                    </div>

                                    <div className="form-group" style={{ maxWidth: '200px' }}>
                                        <label style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Marks *</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🎯</span>
                                            <input
                                                type="number"
                                                value={question.marks}
                                                onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))}
                                                min="1"
                                                required
                                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="btn btn-secondary btn-block"
                            style={{ padding: '1.25rem', fontSize: '1.1rem', borderStyle: 'dashed', borderWidth: '2px' }}
                        >
                            ➕ Add Another Question
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
                                {loading ? 'Saving...' : `Save ${questions.length} Question(s) 💾`}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin/exams')}
                                className="btn btn-secondary"
                                style={{ padding: '1.25rem', fontSize: '1.1rem' }}
                            >
                                Skip & Go to Exams
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuestions;
