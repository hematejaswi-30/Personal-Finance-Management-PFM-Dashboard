import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIAdvisor from './pages/AIAdvisor';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) return <Navigate to="/dashboard" />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={
                <PublicRoute><Login /></PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute><Register /></PublicRoute>
            } />
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/transactions" element={
                <ProtectedRoute><Transactions /></ProtectedRoute>
            } />
            <Route path="/accounts" element={
                <ProtectedRoute><Accounts /></ProtectedRoute>
            } />
            <Route path="/budgets" element={
                <ProtectedRoute><Budgets /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/ai-advisor" element={
                <ProtectedRoute><AIAdvisor /></ProtectedRoute>
            } />
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