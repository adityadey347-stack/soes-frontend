import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Home from './pages/Home';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="app">
                    <Navbar />
                    <div className="main-content" style={{ padding: 0, maxWidth: 'none' }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Student Routes */}
                            <Route
                                path="/student/*"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Default Route */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
