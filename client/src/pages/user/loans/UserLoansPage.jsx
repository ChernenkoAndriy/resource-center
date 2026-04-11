import React, { useState, useEffect } from 'react';
import loanService from '../../../services/loanService';

const UserLoansPage = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLoans = async () => {
            try {
                const data = await loanService.getUserLoans();
                setLoans(data);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadLoans();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-4">Мої позики</h2>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-info" /></div>
            ) : loans.length === 0 ? (
                <div className="alert alert-info border-0 shadow-sm py-5 text-center">
                    <i className="bi bi-journal-x display-4 d-block mb-3"></i>
                    <p className="mb-0">У вас поки немає активних або завершених позик.</p>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded border bg-white">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="px-4 py-3 text-uppercase small text-muted">Книга</th>
                            <th className="py-3 text-uppercase small text-muted">Дата видачі</th>
                            <th className="py-3 text-uppercase small text-muted">Дата повернення</th>
                            <th className="py-3 text-uppercase small text-muted">Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loans.map(loan => (
                            <tr key={loan.id}>
                                <td className="px-4 py-3 fw-bold">{loan.book?.title}</td>
                                <td className="py-3 text-muted">{new Date(loan.loanDate).toLocaleDateString()}</td>
                                <td className="py-3 text-muted">
                                    {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '—'}
                                </td>
                                <td className="py-3">
                                    {loan.returnDate ? (
                                        <span className="badge rounded-pill bg-success-subtle text-success border border-success px-3">
                                                Повернено
                                            </span>
                                    ) : (
                                        <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning px-3">
                                                На руках
                                            </span>
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

export default UserLoansPage;