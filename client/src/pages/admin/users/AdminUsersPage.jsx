import { useState, useEffect } from 'react';
import userService from '../../../services/userService';

const AdminUsersPage = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState(null); // Для індикації завантаження конкретної кнопки

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers();
            // Передбачаємо, що бекенд поверне масив користувачів
            setUsers(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const actionText = user.isActive ? 'заблокувати' : 'розблокувати';
        if (!window.confirm(`Ви впевнені, що хочете ${actionText} цього користувача?`)) return;

        try {
            setActionId(user.id);
            await userService.toggleUserStatus(user.id, user.isActive);
            await loadUsers(); // Перезавантажуємо список після змін
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    };

    // Фільтрація користувачів за ім'ям, прізвищем або поштою
    const filteredUsers = users.filter(u =>
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Керування всіма користувачами</h2>
                <button onClick={onBack} style={{ padding: '8px 16px' }}>Назад</button>
            </div>

            {/* Поле пошуку */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Пошук за іменем або email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {loading && users.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Завантаження...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Користувач</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Статус</th>
                        <th style={styles.th}>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Користувачів не знайдено</td></tr>
                    ) : (
                        filteredUsers.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={styles.td}>{u.id}</td>
                                <td style={styles.td}>{u.firstName} {u.lastName}</td>
                                <td style={styles.td}>{u.email}</td>
                                <td style={styles.td}>
                                        <span style={{
                                            color: u.isActive ? '#27ae60' : '#e74c3c',
                                            fontWeight: 'bold'
                                        }}>
                                            {u.isActive ? 'Активний' : 'Заблокований'}
                                        </span>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleToggleStatus(u)}
                                        disabled={actionId === u.id}
                                        style={{
                                            ...styles.actionBtn,
                                            backgroundColor: u.isActive ? '#e74c3c' : '#27ae60'
                                        }}
                                    >
                                        {actionId === u.id ? 'Обробка...' : (u.isActive ? 'Блокувати' : 'Розблокувати')}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '12px', borderBottom: '2px solid #ddd', fontSize: '14px' },
    td: { padding: '12px', fontSize: '14px' },
    actionBtn: {
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        minWidth: '110px'
    }
};

export default AdminUsersPage;