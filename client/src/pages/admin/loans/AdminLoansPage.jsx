import React, { useState, useEffect } from 'react';
import loanService from '../../../services/loanService';

const AdminLoansPage = ({ onBack }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadLoans(); }, []);

    const loadLoans = async () => {
        setLoading(true);
        try {
            const data = await loanService.getAllLoans();
            setLoans(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id) => {
        try {
            await loanService.returnBook(id);
            loadLoans();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Журнал позик</h2>
                <button className="btn btn-outline-secondary" onClick={onBack}>Назад</button>
            </div>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border" /></div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                        <tr>
                            <th className="px-4">Користувач</th>
                            <th>Книга</th>
                            <th>Дата видачі</th>
                            <th>Статус</th>
                            <th className="text-end px-4">Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loans.map(loan => (
                            <tr key={loan.id}>
                                <td className="px-4">
                                    <strong>{loan.user?.firstName} {loan.user?.lastName}</strong>
                                    <div className="text-muted small">{loan.user?.email}</div>
                                </td>
                                <td>{loan.book?.title}</td>
                                <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                                <td>
                                    {loan.returnDate ? (
                                        <span className="badge bg-success-subtle text-success">Повернено</span>
                                    ) : (
                                        <span className="badge bg-warning-subtle text-warning">Активна</span>
                                    )}
                                </td>
                                <td className="text-end px-4">
                                    {!loan.returnDate && (
                                        <button className="btn btn-sm btn-primary" onClick={() => handleReturn(loan.id)}>
                                            Відмітити повернення
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminLoansPage;