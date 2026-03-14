 import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on app start
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Register
    const register = async (name, email, password) => {
        try {
            const res = await registerUser({ name, email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '❌ Registration failed'
            };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const res = await loginUser({ email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '❌ Login failed'
            };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
