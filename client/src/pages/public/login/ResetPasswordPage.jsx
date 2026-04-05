import { useState } from 'react';
import authService from '../../../services/authService';

const ResetPasswordPage = ({ onComplete }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return setError('Токен відсутній у посиланні');

        try {
            await authService.resetPassword(token, password);
            alert('Пароль успішно змінено!');
            onComplete();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <h2>Новий пароль</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="password"
                    placeholder="Введіть новий пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                />
                <button type="submit">Оновити пароль</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;