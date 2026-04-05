import { useState, useEffect } from 'react';
import bookService from '../../../services/bookService';
import { useNavigate } from 'react-router-dom'; // 1. Додано імпорт хука
import loanService from '../../../services/loanService';

const UserBooksPage = ({ onBack }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setLoading(true);
        try {
            const data = await bookService.getFreeBooks();
            setBooks(data.filter(b => b.isActive));
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async (bookId) => {
        try {
            await loanService.borrowBook(bookId);
            alert('Книгу успішно зайнято! Перевірте ваші позики у профілі.');
            loadBooks(); // Оновлюємо список
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Бібліотечний фонд</h2>
                <button onClick={onBack}>Назад</button>
            </div>

            <input
                type="text"
                placeholder="Пошук за назвою або автором..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />

            {loading ? <p>Завантаження книг...</p> : (
                <div style={styles.grid}>
                    {filteredBooks.map(book => (
                        <div key={book.id} style={styles.card}>
                            <h3>{book.title}</h3>
                            <p>Автор: <strong>{book.author?.fullName || 'Не вказано'}</strong></p>
                            <p style={styles.isbn}>ISBN: {book.isbn}</p>
                            <div style={styles.actions}>
                                <button
                                    onClick={() => navigate(`/books/${book.id}`)}
                                    style={styles.btnDetails}
                                >
                                    Деталі
                                </button>
                                <button
                                    onClick={() => handleBorrow(book.id)}
                                    style={styles.btnBorrow}
                                >
                                    Зайняти
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    searchInput: { width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '4px', border: '1px solid #ddd' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff' },
    isbn: { fontSize: '13px', color: '#7f8c8d' },
    actions: { display: 'flex', gap: '10px', marginTop: '15px' },
    btnDetails: { flex: 1, padding: '8px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    btnBorrow: { flex: 1, padding: '8px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default UserBooksPage;