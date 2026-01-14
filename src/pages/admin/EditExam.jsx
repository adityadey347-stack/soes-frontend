import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const EditExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchExam();
    }, [examId]);

    const fetchExam = async () => {
        try {
            const response = await adminAPI.getExamById(examId);
            const exam = response.data.data.exam;
            setFormData({
                title: exam.title,
                description: exam.description,
                duration: exam.duration,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
            });
        } catch (err) {
            setError('Failed to fetch exam details');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await adminAPI.updateExam(examId, formData);
            setSuccess('Exam updated successfully');
            setTimeout(() => {
                navigate('/admin/exams');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update exam');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>✏️ Edit Exam</h1>
                <p style={{ color: 'var(--text-muted)' }}>Update exam details and requirements</p>
            </div>

            <div className="card glass" style={{ maxWidth: '700px', margin: '0 auto', border: 'none' }}>
                <div className="card-body" style={{ padding: '3rem' }}>
                    {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ marginBottom: '2rem' }}>{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🏷️</span> Exam Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                style={{ padding: '1rem', fontSize: '1.1rem' }}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>📄</span> Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                style={{ padding: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="duration" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>⏱️</span> Duration (mins)
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    style={{ padding: '1rem' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="totalMarks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📊</span> Total Marks
                                </label>
                                <input
                                    type="number"
                                    id="totalMarks"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    style={{ padding: '1rem' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="passingMarks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>✅</span> Passing Marks
                            </label>
                            <input
                                type="number"
                                id="passingMarks"
                                name="passingMarks"
                                value={formData.passingMarks}
                                onChange={handleChange}
                                min="0"
                                required
                                style={{ padding: '1rem' }}
                            />
                        </div>

                        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                                Update Exam Details 💾
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin/exams')}
                                className="btn btn-secondary btn-block"
                                style={{ padding: '1rem' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditExam;
