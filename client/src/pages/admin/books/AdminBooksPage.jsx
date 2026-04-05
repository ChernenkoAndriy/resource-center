import { useState, useEffect } from 'react';
import bookService from '../../../services/bookService';
import BookForm from './BookForm'; // Імпортуємо форму

const AdminBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Стани для модального вікна форми
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setLoading(true);
        try {
            const data = await bookService.getBooks();
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Обробка збереження (створення або оновлення)
    const handleFormSubmit = async (formData) => {
        try {
            if (editingBook) {
                await bookService.updateBook(editingBook.id, formData);
            } else {
                await bookService.createBook(formData);
            }
            setIsFormOpen(false);
            setEditingBook(null);
            loadBooks(); // Оновлюємо список
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditClick = async (id) => {
        try {
            const book = await bookService.getBookById(id);
            setEditingBook(book);
            setIsFormOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити книгу ОСТАТОЧНО?')) {
            try {
                await bookService.hardDeleteBook(id);
                loadBooks();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await bookService.toggleBookStatus(id);
            loadBooks();
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Рендеримо форму, якщо вона відкрита */}
            {isFormOpen && (
                <BookForm
                    book={editingBook}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setIsFormOpen(false); setEditingBook(null); }}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Керування бібліотечним фондом</h2>
                <button
                    onClick={() => setIsFormOpen(true)}
                    style={{ backgroundColor: '#2ecc71', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    + Додати нову книгу
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Пошук за назвою або автором..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                    <th style={styles.th}>Назва</th>
                    <th style={styles.th}>Автор</th>
                    <th style={styles.th}>ISBN</th>
                    <th style={styles.th}>Статус</th>
                    <th style={styles.th}>Дії</th>
                </tr>
                </thead>
                <tbody>
                {filteredBooks.map(book => (
                    <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={styles.td}>{book.title}</td>
                        <td style={styles.td}>{book.author?.fullName}</td>
                        <td style={styles.td}>{book.isbn}</td>
                        <td style={styles.td}>
                                <span style={{ color: book.isActive ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                                    {book.isActive ? 'Активна' : 'Деактивована'}
                                </span>
                        </td>
                        <td style={styles.td}>
                            <button onClick={() => handleEditClick(book.id)} style={styles.btnAction}>Редагувати</button>
                            <button
                                onClick={() => handleToggleStatus(book.id)}
                                style={{ ...styles.btnAction, backgroundColor: '#f39c12' }}
                            >
                                {book.isActive ? 'Блокувати' : 'Активувати'}
                            </button>
                            <button
                                onClick={() => handleDelete(book.id)}
                                style={{ ...styles.btnAction, backgroundColor: '#e74c3c' }}
                            >
                                Видалити
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    th: { padding: '12px', borderBottom: '2px solid #ddd' },
    td: { padding: '12px' },
    btnAction: {
        marginRight: '5px',
        padding: '5px 10px',
        color: 'white',
        backgroundColor: '#3498db',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default AdminBooksPage;