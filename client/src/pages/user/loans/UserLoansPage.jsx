import { useState, useEffect } from 'react';
import loanService from '../../../services/loanService';

const UserLoansPage = ({ onBack }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMyLoans();
    }, []);

    const loadMyLoans = async () => {
        setLoading(true);
        try {
            const data = await loanService.getUserLoans();
            setLoans(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Мої замовлені книги</h2>
                <button onClick={onBack} style={styles.btnBack}>Назад</button>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {loading ? <p style={{ textAlign: 'center' }}>Завантаження історії позик...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                        <th style={styles.th}>Книга</th>
                        <th style={styles.th}>Дата видачі</th>
                        <th style={styles.th}>Термін повернення</th>
                        <th style={styles.th}>Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loans.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#7f8c8d' }}>У вас поки немає активних або минулих позик</td></tr>
                    ) : (
                        loans.map(loan => {
                            const isOverdue = loan.status === 'overdue';
                            const isReturned = loan.status === 'returned';

                            return (
                                <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={styles.td}>
                                        <strong>{loan.book?.title}</strong>
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(loan.issueDate || loan.loanDate).toLocaleDateString()}
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(loan.dueDate).toLocaleDateString()}
                                    </td>
                                    <td style={styles.td}>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: isReturned ? '#d7ffd7' : (isOverdue ? '#ffd7d7' : '#fff9c4'),
                                                color: isReturned ? '#27ae60' : (isOverdue ? '#c0392b' : '#f39c12')
                                            }}>
                                                {isReturned ? 'Повернено' : (isOverdue ? 'Протерміновано' : 'На руках')}
                                            </span>
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
    th: { padding: '15px', borderBottom: '2px solid #dee2e6' },
    td: { padding: '15px' },
    btnBack: { padding: '8px 16px', cursor: 'pointer' },
    badge: {
        padding: '5px 10px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block'
    }
};

export default UserLoansPage;