import { useState } from 'react';
import authService from '../../../services/authService';

const LoginPage = ({ onSwitch, onLoginSuccess, onForgot }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await authService.login(email, password);
            localStorage.setItem('token', result.token);
            onLoginSuccess(result.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <h2 style={{ textAlign: 'center' }}>Вхід у систему</h2>

                {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        required
                        disabled={isLoading}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </label>

                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ваш пароль"
                        required
                        disabled={isLoading}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </label>

                {/* Кнопка "Забули пароль" */}
                <div style={{ textAlign: 'right' }}>
                    <button
                        type="button"
                        onClick={onForgot}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3498db',
                            cursor: 'pointer',
                            fontSize: '13px',
                            padding: '0'
                        }}
                    >
                        Забули пароль?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isLoading ? 'Входимо...' : 'Увійти'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '14px' }}>
                    Немає акаунту?
                    <button
                        type="button"
                        onClick={onSwitch}
                        style={{ border: 'none', background: 'none', color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Зареєструватися
                    </button>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;