import React, { useState } from 'react';
import authService from '../../../services/authService';

const LoginPage = ({ onSwitch, onLoginSuccess, onForgot }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        // Програмна валідація згідно з ТЗ
        if (!email || !password) {
            setError('Будь ласка, заповніть усі поля');
            return false;
        }

        // Регулярний вираз для перевірки шаблону email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Введено некоректний формат електронної пошти');
            return false;
        }

        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await authService.login(email, password);
            localStorage.setItem('token', result.token);
            onLoginSuccess(result.user);
        } catch (err) {
            setError(err.message || 'Помилка авторизації');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4 fw-bold">Вхід у систему</h2>

                            {error && (
                                <div className="alert alert-danger py-2 text-center" role="alert">
                                    <small>{error}</small>
                                </div>
                            )}

                            <form onSubmit={handleLogin} noValidate>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@mail.com"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label small fw-bold">Пароль:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ваш пароль"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="text-end mb-4">
                                    <button
                                        type="button"
                                        className="btn btn-link btn-sm text-decoration-none p-0"
                                        onClick={onForgot}
                                        style={{ fontSize: '13px' }}
                                    >
                                        Забули пароль?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100 mb-3 shadow-sm"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Входимо...
                                        </>
                                    ) : (
                                        'Увійти'
                                    )}
                                </button>

                                <div className="text-center mt-3">
                                    <p className="small mb-0 text-muted">
                                        Немає акаунту?{' '}
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm text-decoration-none fw-bold p-0"
                                            onClick={onSwitch}
                                        >
                                            Зареєструватися
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;