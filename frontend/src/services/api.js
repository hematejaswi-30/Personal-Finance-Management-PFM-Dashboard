
import axios from 'axios';

const API_URL = 'https://niveshai-api.onrender.com/api';
// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AUTH
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getUserProfile = () => api.get('/auth/profile');

// ACCOUNTS
export const getAccounts = () => api.get('/accounts');
export const addAccount = (data) => api.post('/accounts', data);
export const updateAccount = (id, data) => api.put(`/accounts/${id}`, data);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);

// TRANSACTIONS
export const getTransactions = () => api.get('/transactions');
export const addTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getByCategory = () => api.get('/transactions/by-category');
export const getMonthlySummary = () => api.get('/transactions/monthly-summary');

// BUDGETS
export const getBudgets = () => api.get('/budgets');
export const addBudget = (data) => api.post('/budgets', data);
export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);
export const getBudgetSummary = (month) => api.get(`/budgets/summary?month=${month}`);

export default api;
