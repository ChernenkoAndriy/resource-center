const API_URL = 'http://localhost:5000/api/v1';

const loanService = {
    getAllLoans: async (filters = {}) => {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/admin/loans?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження');
        return data.items;
    },

    returnBook: async (loanId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/loans/${loanId}/return`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Помилка повернення');
        }
        return true;
    },

    sendReminder: async (loanId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/loans/${loanId}/remind`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Помилка надсилання');
        }
        return true;
    },

    borrowBook: async (bookId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/loans`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Не вдалося зайняти книгу');
        return data;
    },

    getUserLoans: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/loans/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження позик');
        return data; // Бекенд повертає масив позик через loanRepository.findByUser
    }
};

export default loanService;