import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../../../services/bookService';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const data = await bookService.getBookById(id);
                setBook(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження деталей книги...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Помилка: {error}</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '40px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                ← Назад
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h1 style={{ margin: '0', color: '#2c3e50' }}>{book.title}</h1>

                <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                    <p><strong>Автор:</strong> {book.author?.fullName || 'Невідомий автор'}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Статус:</strong>
                        <span style={{ marginLeft: '10px', color: book.isActive ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                            {book.isActive ? 'Доступна' : 'Тимчасово недоступна'}
                        </span>
                    </p>
                </div>

                <div>
                    <h3>Про книгу:</h3>
                    <p style={{ lineHeight: '1.6', color: '#34495e', whiteSpace: 'pre-wrap' }}>
                        {book.summary || 'Опис відсутній.'}
                    </p>
                </div>

                {book.author?.biography && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Про автора:</h4>
                        <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>{book.author.biography}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailsPage;