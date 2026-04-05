const API_URL = 'http://localhost:5000/api/v1'; // Базовий шлях згідно з вашим setup.js

const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка входу');
        return data;
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка реєстрації');
        return data;
    },

    forgotPassword: async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка запиту');
        return data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password: newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка оновлення');
        return data;
    },

    blockUser: async (userId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/${userId}/block`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка блокування');
        return data;
    },

    getDebtors: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/debtors`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження');
        return data.data; // сервер повертає { status, count, data }
    }
};

export default authService;