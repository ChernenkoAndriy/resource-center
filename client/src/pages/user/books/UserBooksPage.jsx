import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../../../services/bookService';

const UserBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadBooks = async (query = '') => {
        setLoading(true);
        try {
            const data = await bookService.getFreeBooks({ title: query });
            setBooks(data);
        } catch (err) {
            console.error('Помилка завантаження:', err);
        } finally {
            setLoading(false);
        }
    };

    // Реалізація Debounce: запит на сервер йде через 500мс після того, як користувач перестав друкувати
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadBooks(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <div className="container">
            <h1 className="mb-4 fw-bold text-primary">Доступні книги</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Пошук за назвою (серверний)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {books.length > 0 ? books.map(book => (
                        <div key={book.id} className="col">
                            <div className="card h-100 shadow-sm border-0 card-hover">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-dark">{book.title}</h5>
                                    <p className="card-text text-muted mb-1">
                                        <i className="bi bi-person me-2"></i>
                                        {book.author?.firstName} {book.author?.lastName}
                                    </p>
                                    <p className="small text-secondary">ISBN: {book.isbn}</p>
                                </div>
                                <div className="card-footer bg-white border-0 pb-3">
                                    <button
                                        className="btn btn-outline-primary w-100 rounded-pill"
                                        onClick={() => navigate(`/books/${book.id}`)}
                                    >
                                        Детальніше
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center text-muted my-5">
                            Книг за вашим запитом не знайдено
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserBooksPage;