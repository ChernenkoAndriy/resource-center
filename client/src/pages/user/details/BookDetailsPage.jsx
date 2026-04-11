import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../../../services/bookService';
import loanService from '../../../services/loanService';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBook = async () => {
            try {
                const data = await bookService.getBookById(id);
                setBook(data);
            } catch (err) {
                alert(err.message);
                navigate('/books');
            } finally {
                setLoading(false);
            }
        };
        loadBook();
    }, [id, navigate]);

    const handleLoan = async () => {
        try {
            await loanService.borrowBook(book.id);
            alert('Книгу успішно позичено!');
            navigate('/my-loans');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-grow text-primary" /></div>;

    return (
        <div className="container mt-4">
            <button className="btn btn-link text-decoration-none mb-3 p-0" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-1"></i> Назад до списку
            </button>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h1 className="display-5 fw-bold mb-3">{book.title}</h1>
                            <div className="d-flex gap-2 mb-4">
                                <span className="badge bg-primary-subtle text-primary px-3 py-2">Рік: {book.publishedYear || '—'}</span>
                                <span className="badge bg-secondary-subtle text-secondary px-3 py-2">ISBN: {book.isbn}</span>
                            </div>
                            <h4 className="fw-bold">Опис</h4>
                            <p className="lead text-muted">{book.description || 'Опис для цієї книги ще не додано.'}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-body p-4 text-center">
                            <div className="mb-4">
                                <i className="bi bi-book text-warning" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h5 className="fw-bold">{book.author?.fullName}</h5>
                            <p className="text-muted small mb-4">Автор книги</p>
                            <hr />
                            <button
                                className="btn btn-primary btn-lg w-100 mb-3 shadow-sm"
                                onClick={handleLoan}
                            >
                                Позичити книгу
                            </button>
                            <p className="text-muted extra-small">
                                Натискаючи кнопку, ви погоджуєтесь з правилами нашого ресурсного центру.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;