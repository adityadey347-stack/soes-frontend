import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user, login, deleteAccount } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                ...formData,
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        try {
            const response = await authAPI.updateProfile({
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined
            });

            // Update local user data in context
            const updatedUser = response.data.data;
            const token = localStorage.getItem('token');
            login(updatedUser, token);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData({ ...formData, password: '', confirmPassword: '' });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>⚙️ Admin Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your account profile and security preferences</p>
            </div>

            <div className="card glass" style={{ maxWidth: '700px', border: 'none' }}>
                <div className="card-body" style={{ padding: '3rem' }}>
                    {message.text && (
                        <div className={`alert alert-${message.type}`} style={{ marginBottom: '2rem' }}>
                            {message.type === 'success' ? '✅' : '❌'} {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>👤</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>✉️</span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            margin: '3rem 0',
                            padding: '2rem',
                            background: 'rgba(99, 102, 241, 0.03)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(99, 102, 241, 0.1)'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>🔐 Change Password</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                Leave blank if you don't want to change your current password.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔑</span>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Min 6 characters"
                                            style={{ paddingLeft: '2.5rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🛡️</span>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ paddingLeft: '2.5rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            style={{ padding: '1.25rem', fontSize: '1.1rem', fontWeight: '700' }}
                            disabled={loading}
                        >
                            {loading ? 'Saving Changes...' : 'Update Profile & Security 💾'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '4rem',
                        padding: '2rem',
                        background: 'rgba(239, 68, 68, 0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(239, 68, 68, 0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>⚠️ Danger Zone</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            onClick={async () => {
                                if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                                    setLoading(true);
                                    const result = await deleteAccount();
                                    if (!result.success) {
                                        setMessage({ type: 'error', text: result.message });
                                        setLoading(false);
                                    }
                                }
                            }}
                            className="btn btn-danger"
                            style={{ fontWeight: '700' }}
                            disabled={loading}
                        >
                            Delete My Account 🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
