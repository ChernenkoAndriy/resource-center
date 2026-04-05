import { useState, useEffect } from 'react';
import loanService from '../../../services/loanService';

const AdminLoansPage = ({ onBack }) => {
    const [loans, setLoans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        setLoading(true);
        try {
            const data = await loanService.getAllLoans();
            setLoans(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (loanId) => {
        if (!window.confirm('Підтвердити повернення книги?')) return;
        try {
            await loanService.returnBook(loanId);
            alert('Книгу успішно повернено');
            loadLoans();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemind = async (loanId) => {
        try {
            await loanService.sendReminder(loanId);
            alert('Нагадування надіслано на email користувача');
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredLoans = loans.filter(l =>
        l.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Журнал позик та заборгованостей</h2>
                <button onClick={onBack}>Назад</button>
            </div>

            <input
                type="text"
                placeholder="Пошук за книгою або email користувача..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ddd' }}
            />

            {loading ? <p>Завантаження даних...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={styles.th}>Користувач</th>
                        <th style={styles.th}>Книга</th>
                        <th style={styles.th}>Дата видачі</th>
                        <th style={styles.th}>Дедлайн</th>
                        <th style={styles.th}>Статус</th>
                        <th style={styles.th}>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredLoans.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Записів не знайдено</td></tr>
                    ) : (
                        filteredLoans.map(loan => {
                            let statusText = 'Активна';
                            let statusStyles = { backgroundColor: '#fff9c4', color: '#fbc02d' };

                            if (loan.status === 'returned') {
                                statusText = 'Повернено';
                                statusStyles = { backgroundColor: '#d7ffd7', color: '#27ae60' };
                            } else if (loan.status === 'overdue') {
                                statusText = 'Протерміновано';
                                statusStyles = { backgroundColor: '#ffd7d7', color: '#c0392b' };
                            }

                            return (
                                <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={styles.td}>{loan.user?.email}</td>
                                    <td style={styles.td}>{loan.book?.title}</td>
                                    <td style={styles.td}>{new Date(loan.loanDate || loan.issueDate).toLocaleDateString()}</td>
                                    <td style={styles.td}>{new Date(loan.dueDate).toLocaleDateString()}</td>
                                    <td style={styles.td}>
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        ...statusStyles
                    }}>
                        {statusText}
                    </span>
                                    </td>
                                    <td style={styles.td}>
                                        {loan.status !== 'returned' && (
                                            <button
                                                onClick={() => handleReturn(loan.id)}
                                                style={styles.btnReturn}
                                            >
                                                Повернути
                                            </button>
                                        )}

                                        {loan.status === 'overdue' && (
                                            <button
                                                onClick={() => handleRemind(loan.id)}
                                                style={styles.btnRemind}
                                            >
                                                Нагадати
                                            </button>
                                        )}

                                        {loan.status === 'returned' && (
                                            <span style={{ color: '#95a5a6', fontSize: '13px' }}>Архів</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' },
    td: { padding: '12px' },
    btnReturn: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer' },
    btnRemind: { backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

export default AdminLoansPage;