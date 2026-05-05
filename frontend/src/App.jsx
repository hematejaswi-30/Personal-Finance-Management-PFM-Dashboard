import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIAdvisor from './pages/AIAdvisor';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Income from './pages/Income';
import WelcomeScreen from './pages/WelcomeScreen';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <AppLayout>{children}</AppLayout>;
};

// Pages that need auth but manage their own full-screen layout
const ProtectedRouteNoLayout = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) return <Navigate to="/welcome" />;
    return children;
};

const AppRoutes = () => (
    <Routes>
        <Route path="/"             element={<Navigate to="/login" />} />
        <Route path="/login"        element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"     element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/welcome"      element={<ProtectedRouteNoLayout><WelcomeScreen /></ProtectedRouteNoLayout>} />
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/income"       element={<ProtectedRoute><Income /></ProtectedRoute>} />
        <Route path="/accounts"     element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/budgets"      element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
        <Route path="/analytics"    element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/ai-advisor"   element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />
        {/* New pages — own full-screen design */}
        <Route path="/settings"     element={<ProtectedRouteNoLayout><Settings /></ProtectedRouteNoLayout>} />
        <Route path="/profile"      element={<ProtectedRouteNoLayout><Profile /></ProtectedRouteNoLayout>} />
        <Route path="/onboarding"   element={<ProtectedRouteNoLayout><Onboarding /></ProtectedRouteNoLayout>} />
        <Route path="*"             element={<Navigate to="/login" />} />
    </Routes>
);

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;