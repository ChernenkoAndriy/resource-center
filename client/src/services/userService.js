const API_URL = 'http://localhost:5000/api/v1';

const userService = {

    getAllUsers: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження');
        return data.data;
    },

    toggleUserStatus: async (userId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка зміни статусу');

        return data.data; // Повертаємо оновлений об'єкт користувача
    },

    getDebtors: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/debtors`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження боржників');

        return data.data;
    }
};

export default userService;