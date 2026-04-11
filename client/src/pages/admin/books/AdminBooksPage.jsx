import React, { useState, useEffect } from 'react';
import bookService from '../../../services/bookService';
import BookForm from './BookForm';

const AdminBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadBooks = async () => {
        setLoading(true);
        try {
            // Передаємо параметри для серверної обробки
            const data = await bookService.getBooks({
                title: searchTerm,
                sort: 'title',
                order: sortOrder
            });
            setBooks(data);
        } catch (err) {
            alert('Помилка: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(loadBooks, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, sortOrder]);

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені?')) {
            try {
                await bookService.deleteBook(id);
                loadBooks();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Керування книгами</h2>
                <button className="btn btn-success shadow-sm" onClick={() => setShowForm(true)}>
                    <i className="bi bi-plus-lg me-2"></i>Додати книгу
                </button>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body bg-light">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Пошук за назвою або ISBN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="ASC">Сортувати: А-Я ↑</option>
                                <option value="DESC">Сортувати: Я-А ↓</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                    <tr>
                        <th>Назва</th>
                        <th>Автор</th>
                        <th>ISBN</th>
                        <th>Статус</th>
                        <th className="text-end">Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm"></div></td></tr>
                    ) : books.map(book => (
                        <tr key={book.id}>
                            <td className="fw-bold">{book.title}</td>
                            <td>{book.author?.firstName} {book.author?.lastName}</td>
                            <td className="text-muted small">{book.isbn}</td>
                            <td>
                                    <span className={`badge ${book.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                        {book.isActive ? 'Активна' : 'Архів'}
                                    </span>
                            </td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditingBook(book); setShowForm(true); }}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.id)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <BookForm
                    book={editingBook}
                    onClose={() => { setShowForm(false); setEditingBook(null); }}
                    onSuccess={() => { setShowForm(false); setEditingBook(null); loadBooks(); }}
                />
            )}
        </div>
    );
};

export default AdminBooksPage;