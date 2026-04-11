import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Додаткова валідація на клієнті (вимога ТЗ)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Будь ласка, введіть коректний email');
            return;
        }

        try {
            await authService.register(formData);
            navigate('/info', { state: { message: 'Реєстрація успішна! Перевірте пошту для підтвердження.' } });
        } catch (err) {
            setError(err.message || 'Помилка реєстрації');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0">
                        <div className="card-body p-5">
                            <h2 className="card-title text-center mb-4">Реєстрація</h2>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Ім'я</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Прізвище</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="example@mail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="мінімум 6 символів"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
                                    Створити аккаунт
                                </button>
                            </form>
                            <div className="text-center">
                                <span>Вже є аккаунт? </span>
                                <button className="btn btn-link p-0" onClick={() => navigate('/login')}>Увійти</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;