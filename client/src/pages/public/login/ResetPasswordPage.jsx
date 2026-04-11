import React, { useState } from 'react';
import authService from '../../../services/authService';

const ResetPasswordPage = ({ onComplete }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Токен відсутній у посиланні. Будь ласка, скористайтеся посиланням з листа.');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(token, password);
            alert('Пароль успішно змінено! Тепер ви можете увійти.');
            onComplete();
        } catch (err) {
            setError(err.message || 'Не вдалося оновити пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Новий пароль</h2>

                            {error && <div className="alert alert-danger small">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label">Введіть новий пароль</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Мінімум 6 символів"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        disabled={isLoading}
                                    />
                                    <div className="form-text mt-2">
                                        Використовуйте надійний пароль, який ви раніше не використовували в цій системі.
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Оновлення...
                                        </>
                                    ) : 'Оновити пароль'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;