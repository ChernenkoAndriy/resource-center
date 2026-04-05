const API_URL = 'http://localhost:5000/api/v1';

const bookService = {
    getBooks: async (params = {}) => {
        const token = localStorage.getItem('token');
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/books?${query}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження');
        return data;
    },

    getFreeBooks: async (params = {}) => {
        const token = localStorage.getItem('token');
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/books/free${query}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження');
        return data;
    },

    getBookById: async (id) => {
        const response = await fetch(`${API_URL}/books/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Книгу не знайдено');
        return data;
    },

    createBook: async (bookData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/books`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка створення');
        return data;
    },

    updateBook: async (id, bookData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/books/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка оновлення');
        return data;
    },

    toggleBookStatus: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/books/${id}/status`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка зміни статусу');
        return data.book;
    },

    hardDeleteBook: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка видалення');
        return true;
    }
};

export default bookService;