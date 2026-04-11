import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';

const AdminUsersPage = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers();
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
            await userService.toggleUserStatus(user.id);
            await loadUsers();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Керування користувачами</h2>
                <button className="btn btn-outline-secondary" onClick={onBack}>Назад</button>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Пошук за ім'ям, прізвищем або email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                    <tr>
                        <th className="px-4">ID</th>
                        <th>Користувач</th>
                        <th>Email</th>
                        <th>Статус</th>
                        <th className="text-end px-4">Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading && users.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-5">Завантаження...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">Користувачів не знайдено</td></tr>
                    ) : (
                        filteredUsers.map(u => (
                            <tr key={u.id}>
                                <td className="px-4 text-muted small">#{u.id}</td>
                                <td className="fw-bold">{u.firstName} {u.lastName}</td>
                                <td>{u.email}</td>
                                <td>
                                        <span className={`badge rounded-pill ${u.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                            {u.isActive ? 'Активний' : 'Заблокований'}
                                        </span>
                                </td>
                                <td className="text-end px-4">
                                    <button
                                        onClick={() => handleToggleStatus(u)}
                                        disabled={actionId === u.id}
                                        className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'} px-3`}
                                    >
                                        {actionId === u.id ? (
                                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                        ) : (u.isActive ? 'Блокувати' : 'Розблокувати')}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;