import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get role from query params
    const queryParams = new URLSearchParams(location.search);
    const expectedRole = queryParams.get('role'); // 'admin' or 'student'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            const userRole = result.user.role;

            // Enforce role restriction if expectedRole is provided
            if (expectedRole && userRole !== expectedRole) {
                logout();
                setError(`Access Denied: This portal is for ${expectedRole === 'admin' ? 'Administrators' : 'Students'} only.`);
                setLoading(false);
                return;
            }

            // Redirect based on role
            if (userRole === 'admin') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>⚡ <span className="logo-text">SOES</span></h1>
                    <h2>{expectedRole ? `${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)} Login` : 'Welcome Back'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {expectedRole
                            ? `Access the ${expectedRole} portal to continue`
                            : 'Login to continue your journey'}
                    </p>
                </div>

                {error && <div className="alert alert-error" style={{ fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
