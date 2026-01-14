import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">
                    <span>Secure</span><br />
                    Exam System
                </h1>
                <p className="hero-subtitle">
                    A comprehensive and reliable platform for conducting secure
                    online examinations with real-time monitoring and instant results
                </p>

                <div className="feature-tags">
                    <div className="feature-tag">
                        <span style={{ color: '#10b981' }}>✅</span> Instant Results
                    </div>
                    <div className="feature-tag">
                        <span style={{ color: '#6366f1' }}>⏱️</span> Smart Timer
                    </div>
                    <div className="feature-tag">
                        <span style={{ color: '#a855f7' }}>🛡️</span> Secure Access
                    </div>
                </div>
            </section>

            {/* Portal Grid */}
            <div className="portal-grid">
                {/* Admin Portal Card */}
                <div className="portal-card" style={{ '--glow-color': '#6366f1', '--dot-color': '#a855f7' }}>
                    <div className="portal-icon-wrapper" style={{ '--icon-bg': 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                        👥
                    </div>
                    <h2>Admin Portal</h2>
                    <p>
                        Complete control over exam creation, question management,
                        and performance analytics
                    </p>
                    <ul className="portal-features">
                        <li>Create unlimited exams</li>
                        <li>Real-time performance monitoring</li>
                        <li>Advanced question bank</li>
                    </ul>
                    <Link to="/login?role=admin" className="portal-link">
                        Enter Portal <span>→</span>
                    </Link>
                </div>

                {/* Student Portal Card */}
                <div className="portal-card" style={{ '--glow-color': '#10b981', '--dot-color': '#10b981' }}>
                    <div className="portal-icon-wrapper" style={{ '--icon-bg': 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
                        📄
                    </div>
                    <h2>Student Portal</h2>
                    <p>
                        Seamless exam experience with instant results and
                        comprehensive performance tracking
                    </p>
                    <ul className="portal-features">
                        <li>Take exams anytime, anywhere</li>
                        <li>Instant score calculation</li>
                        <li>Track your progress</li>
                    </ul>
                    <Link to="/login?role=student" className="portal-link">
                        Enter Portal <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
