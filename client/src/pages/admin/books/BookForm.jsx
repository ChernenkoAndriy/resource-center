import { useState, useEffect } from 'react';
import authorService from '../../../services/authorService';

const BookForm = ({ book, onSubmit, onCancel }) => {
    const [authors, setAuthors] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        isbn: '',
        summary: '',
        authorId: ''
    });

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await authorService.getAllAuthors();
                setAuthors(data);
            } catch (err) {
                console.error("Помилка завантаження авторів:", err);
            }
        };
        fetchAuthors();

        if (book) {
            setFormData({
                title: book.title || '',
                isbn: book.isbn || '',
                summary: book.summary || '',
                authorId: book.author?.id || ''
            });
        }
    }, [book]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={formStyles.overlay}>
            <form onSubmit={handleSubmit} style={formStyles.modal}>
                <h3>{book ? 'Редагувати книгу' : 'Додати нову книгу'}</h3>

                <input
                    name="title"
                    placeholder="Назва книги"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={formStyles.input}
                />

                <input
                    name="isbn"
                    placeholder="ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    style={formStyles.input}
                />

                <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={handleChange}
                    required
                    style={formStyles.input}
                >
                    <option value="">Оберіть автора</option>
                    {authors.map(a => (
                        <option key={a.id} value={a.id}>{a.fullName}</option>
                    ))}
                </select>

                <textarea
                    name="summary"
                    placeholder="Короткий опис"
                    value={formData.summary}
                    onChange={handleChange}
                    style={{ ...formStyles.input, height: '80px' }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} style={formStyles.btnCancel}>Скасувати</button>
                    <button type="submit" style={formStyles.btnSubmit}>
                        {book ? 'Зберегти зміни' : 'Створити'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const formStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
    btnSubmit: { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' },
    btnCancel: { backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }
};

export default BookForm;