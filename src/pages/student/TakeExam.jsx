import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const TakeExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const hasFetched = useRef(false);

    // Anti-cheat: Disable right-click and copy-paste
    useEffect(() => {
        if (!isExamStarted) return;

        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            // Disable Ctrl+C, Ctrl+V, Ctrl+U, F12
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u')) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                triggerViolation('Keyboard shortcuts are disabled during the exam.');
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isExamStarted]);

    // Anti-cheat: Tab switching detection
    useEffect(() => {
        if (!isExamStarted || submitting) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerViolation('Warning: You switched tabs or minimized the window. This is recorded as a violation.');
            }
        };

        const handleBlur = () => {
            triggerViolation('Warning: You left the exam window. Please stay focused on the exam.');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isExamStarted, submitting]);

    // Anti-cheat: Fullscreen enforcement
    useEffect(() => {
        if (!isExamStarted || submitting) return;

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                triggerViolation('Warning: You exited full-screen mode. Please stay in full-screen to continue the exam.');
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, [isExamStarted, submitting]);

    const triggerViolation = (message) => {
        setViolationCount((prev) => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                handleSubmit(true, 'Too many violations! Your exam has been submitted automatically.');
                return newCount;
            }
            setWarningMessage(message);
            setShowWarning(true);
            return newCount;
        });
    };

    const startExam = async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            }
            setIsExamStarted(true);
        } catch (err) {
            console.error('Fullscreen error:', err);
            setIsExamStarted(true); // Still start even if fullscreen fails
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchExamData = async () => {
            try {
                const response = await studentAPI.startExam(examId);
                const { exam, questions, startedAt } = response.data.data;
                setExam(exam);
                setQuestions(questions);

                // Calculate remaining time based on server start time
                const startTime = new Date(startedAt).getTime();
                const durationMs = exam.duration * 60 * 1000;
                const endTime = startTime + durationMs;
                const now = new Date().getTime();
                const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

                setTimeLeft(remainingSeconds);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load exam');
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [examId]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true, 'Time is up! Your exam has been submitted automatically.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    const handleSubmit = async (isAutoSubmit = false, customMessage = '') => {
        if (submitting) return;

        if (!isAutoSubmit && !window.confirm('Are you sure you want to submit your exam?')) {
            return;
        }

        setSubmitting(true);

        // Format answers for API: [{ questionId, selectedAnswer }]
        const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer
        }));

        // Calculate time taken in seconds
        const timeTaken = (exam.duration * 60) - timeLeft;

        try {
            await studentAPI.submitExam(examId, {
                answers: formattedAnswers,
                timeTaken,
                violations: violationCount
            });
            alert(customMessage || (isAutoSubmit ? 'Time is up! Your exam has been submitted automatically.' : 'Exam submitted successfully!'));
            navigate('/student/results');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit exam');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container">Loading Exam...</div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
    if (!exam || questions.length === 0) return <div className="container">Exam not found or has no questions</div>;

    if (!isExamStarted) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
                <div className="card glass" style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem' }}>
                    <h1 style={{ marginBottom: '1.5rem' }}>🛡️ Anti-Cheat Protection</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        This exam is protected by our anti-cheat system. By starting, you agree to:
                    </p>
                    <ul style={{ textAlign: 'left', marginBottom: '2.5rem', display: 'inline-block' }}>
                        <li style={{ marginBottom: '0.75rem' }}>✅ Stay in <strong>Full-screen mode</strong></li>
                        <li style={{ marginBottom: '0.75rem' }}>✅ Not switch tabs or windows</li>
                        <li style={{ marginBottom: '0.75rem' }}>✅ Not use right-click or copy-paste</li>
                    </ul>
                    <div className="alert alert-warning" style={{ marginBottom: '2.5rem' }}>
                        ⚠️ 3 violations will result in <strong>automatic submission</strong>.
                    </div>
                    <button onClick={startExam} className="btn btn-primary btn-block" style={{ padding: '1.25rem', fontSize: '1.25rem' }}>
                        I Understand, Start Exam 🚀
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start', paddingBottom: '4rem' }}>
            {/* Warning Modal */}
            {showWarning && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem'
                }}>
                    <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '2.5rem', border: '2px solid var(--danger)' }}>
                        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>🚨 Violation Detected!</h2>
                        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>{warningMessage}</p>
                        <div style={{ marginBottom: '2rem', fontWeight: '700', fontSize: '1.25rem' }}>
                            Violations: <span style={{ color: 'var(--danger)' }}>{violationCount} / 3</span>
                        </div>
                        <button onClick={() => setShowWarning(false)} className="btn btn-primary btn-block">
                            I understand, continue exam
                        </button>
                    </div>
                </div>
            )}

            {/* Main Question Area */}
            <div className="exam-main">
                <div className="dashboard-header glass" style={{
                    position: 'sticky',
                    top: '80px',
                    zIndex: 100,
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem' }}>{exam.title}</h1>
                        <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                    </div>
                    <div style={{
                        background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        color: timeLeft < 60 ? 'var(--danger)' : 'var(--primary)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        border: '1px solid currentColor',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        animation: timeLeft < 60 ? 'pulse 1s infinite' : 'none'
                    }}>
                        <span>⏱️</span>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="card glass" style={{ marginBottom: '2rem', border: 'none' }}>
                    <div className="card-body" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>
                                {currentQuestion.questionText}
                            </h2>
                            <span className="badge" style={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: 'var(--primary)',
                                whiteSpace: 'nowrap',
                                marginLeft: '1.5rem'
                            }}>
                                {currentQuestion.marks} Marks
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {currentQuestion.options.map((opt, optIndex) => {
                                const isSelected = answers[currentQuestion._id] === optIndex;
                                return (
                                    <label
                                        key={optIndex}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            padding: '1.25rem',
                                            borderRadius: 'var(--radius-md)',
                                            background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-main)',
                                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            transition: 'var(--transition)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'none'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion._id}`}
                                            value={optIndex}
                                            checked={isSelected}
                                            onChange={() => handleOptionSelect(currentQuestion._id, optIndex)}
                                            style={{
                                                marginRight: '1.25rem',
                                                width: '22px',
                                                height: '22px',
                                                accentColor: 'var(--primary)'
                                            }}
                                        />
                                        <span style={{ fontSize: '1.1rem', fontWeight: isSelected ? '600' : '400' }}>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
                    <button
                        onClick={handlePrevious}
                        className="btn btn-secondary"
                        disabled={currentQuestionIndex === 0}
                        style={{ flex: 1, padding: '1rem' }}
                    >
                        <span>⬅️</span> Previous
                    </button>

                    <button
                        onClick={handleSkip}
                        className="btn btn-secondary"
                        disabled={isLastQuestion}
                        style={{ flex: 1, padding: '1rem' }}
                    >
                        Skip <span>⏭️</span>
                    </button>

                    {!isLastQuestion ? (
                        <button
                            onClick={handleNext}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '1rem' }}
                        >
                            Next <span>➡️</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSubmit(false)}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '1rem' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : '🏁 Finish & Submit'}
                        </button>
                    )}
                </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="exam-sidebar" style={{ position: 'sticky', top: '80px' }}>
                <div className="card glass" style={{ border: 'none' }}>
                    <div className="card-header" style={{ background: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🧩</span> Navigator
                        </h3>
                    </div>
                    <div className="card-body" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                            {questions.map((_, index) => {
                                const isAnswered = answers[questions[index]._id] !== undefined;
                                const isCurrent = index === currentQuestionIndex;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentQuestionIndex(index)}
                                        style={{
                                            aspectRatio: '1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--border)',
                                            background: isCurrent
                                                ? 'var(--primary)'
                                                : isAnswered
                                                    ? 'var(--secondary)'
                                                    : 'white',
                                            color: (isCurrent || isAnswered) ? 'white' : 'var(--text-main)',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            transition: 'var(--transition)',
                                            boxShadow: isCurrent ? '0 4px 10px rgba(99, 102, 241, 0.3)' : 'none'
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '14px', height: '14px', background: 'var(--primary)', borderRadius: '3px' }}></div>
                                <span style={{ fontWeight: '500' }}>Current Question</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '14px', height: '14px', background: 'var(--secondary)', borderRadius: '3px' }}></div>
                                <span style={{ fontWeight: '500' }}>Answered</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '14px', height: '14px', background: 'white', border: '1px solid var(--border)', borderRadius: '3px' }}></div>
                                <span style={{ fontWeight: '500' }}>Unanswered</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <button
                                onClick={() => handleSubmit(false)}
                                className="btn btn-primary btn-block"
                                disabled={submitting}
                                style={{ padding: '1rem' }}
                            >
                                Submit Exam 🏁
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default TakeExam;

