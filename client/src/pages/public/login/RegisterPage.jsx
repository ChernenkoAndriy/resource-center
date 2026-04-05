import { useState } from 'react';
import authService from '../../../services/authService';

const RegisterPage = ({ onSwitch, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authService.register(formData);
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <h2>Реєстрація</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}

                <input name="firstName" placeholder="Ім'я" onChange={handleChange} required disabled={isLoading} />
                <input name="lastName" placeholder="Прізвище" onChange={handleChange} required disabled={isLoading} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required disabled={isLoading} />
                <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required disabled={isLoading} />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Надсилаємо лист...' : 'Зареєструватися'}
                </button>

                <p style={{ textAlign: 'center' }}>
                    Вже маєте акаунт? <button type="button" onClick={onSwitch} /* ... style ... */>Увійти</button>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;