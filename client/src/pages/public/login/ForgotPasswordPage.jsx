import React, { useState } from 'react';
import authService from '../../../services/authService';

const ForgotPasswordPage = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await authService.forgotPassword(email);
            setMessage('Інструкції надіслано на вашу пошту');
        } catch (err) {
            setError(err.message || 'Сталася помилка');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h3 className="card-title text-center mb-4">Відновлення пароля</h3>

                            {message && <div className="alert alert-success small">{message}</div>}
                            {error && <div className="alert alert-danger small">{error}</div>}

                            <p className="text-muted small mb-4">
                                Введіть вашу електронну адресу, і ми надішлемо вам посилання для зміни пароля.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Ваш Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mb-3">
                                    Надіслати посилання
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-link w-100 text-decoration-none"
                                    onClick={onBack}
                                >
                                    Назад до входу
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;