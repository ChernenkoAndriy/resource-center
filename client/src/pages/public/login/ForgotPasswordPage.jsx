import { useState } from 'react';
import authService from '../../../services/authService';

const ForgotPasswordPage = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(email);
            setMessage('Інструкції надіслано на вашу пошту');
            setError('');
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <h2>Відновлення пароля</h2>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="email"
                    placeholder="Ваш Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Надіслати посилання</button>
                <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                    Назад до входу
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;