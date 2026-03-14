import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Public Route Component
// Redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public routes */}
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
