import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const CreateExam = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

        // Validation
        if (parseInt(formData.passingMarks) > parseInt(formData.totalMarks)) {
            setError('Passing marks cannot exceed total marks');
            return;
        }

        setLoading(true);

        try {
            const response = await adminAPI.createExam({
                ...formData,
                duration: parseInt(formData.duration),
                totalMarks: parseInt(formData.totalMarks),
                passingMarks: parseInt(formData.passingMarks),
            });

            setSuccess('Exam created successfully!');
            const examId = response.data.data._id;

            // Redirect to add questions page after 1.5 seconds
            setTimeout(() => {
                navigate(`/admin/exam/${examId}/add-questions`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create exam');
        }

        setLoading(false);
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>📝 Create New Exam</h1>
                <p style={{ color: 'var(--text-muted)' }}>Set up your exam details and requirements</p>
            </div>

            <div className="card glass" style={{ maxWidth: '700px', margin: '0 auto', border: 'none' }}>
                <div className="card-body" style={{ padding: '3rem' }}>
                    {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ marginBottom: '2rem' }}>{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🏷️</span> Exam Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Advanced Web Development"
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
                                placeholder="What will this exam cover?"
                                rows="3"
                                style={{ padding: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="duration" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>⏱️</span> Duration (mins) *
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 60"
                                    min="1"
                                    required
                                    style={{ padding: '1rem' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="totalMarks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📊</span> Total Marks *
                                </label>
                                <input
                                    type="number"
                                    id="totalMarks"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                    placeholder="e.g., 100"
                                    min="1"
                                    required
                                    style={{ padding: '1rem' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="passingMarks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>✅</span> Passing Marks *
                            </label>
                            <input
                                type="number"
                                id="passingMarks"
                                name="passingMarks"
                                value={formData.passingMarks}
                                onChange={handleChange}
                                placeholder="e.g., 40"
                                min="0"
                                required
                                style={{ padding: '1rem' }}
                            />
                        </div>

                        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: '1rem', fontSize: '1.1rem' }}>
                                {loading ? 'Creating...' : 'Create Exam & Add Questions 🚀'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
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

export default CreateExam;
