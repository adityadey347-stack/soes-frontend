import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin, isStudent } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            className={`navbar ${isHomePage ? 'navbar-transparent' : ''}`}
            style={isHomePage ? { position: 'absolute', width: '100%', borderBottom: 'none' } : {}}
        >
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">⚡</span>
                    <span className="logo-text">SOES</span>
                </Link>

                {user && (
                    <div className="navbar-menu">
                        <div className="navbar-user">
                            <span>👤 {user.name}</span>
                            <span className="badge" style={{
                                background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: user.role === 'admin' ? 'var(--primary)' : 'var(--secondary)',
                                border: '1px solid currentColor'
                            }}>
                                {user.role}
                            </span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-logout">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
