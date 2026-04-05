const API_URL = 'http://localhost:5000/api/v1';

const authorService = {

    getAllAuthors: async (sort = 'ASC') => {
        const response = await fetch(`${API_URL}/authors?sort=${sort}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка завантаження авторів');
        return data;
    },

    getAuthorById: async (id) => {
        const response = await fetch(`${API_URL}/authors/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Автора не знайдено');
        return data;
    },

    createAuthor: async (authorData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/authors`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authorData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка створення автора');
        return data;
    },

    updateAuthor: async (id, authorData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/authors/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authorData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка оновлення автора');
        return data;
    },

    deleteAuthor: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/authors/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка видалення автора');
        return true;
    }
};

export default authorService;