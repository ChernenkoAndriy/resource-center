const InfoPage = ({ onBackToLogin }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', textAlign: 'center' }}>
            <div style={{ maxWidth: '400px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2 style={{ color: '#2c3e50' }}>Майже готово! 📧</h2>
                <p>Ми надіслали лист для підтвердження на вашу електронну адресу.</p>
                <p>Будь ласка, перевірте пошту (та папку Спам) і натисніть на посилання у листі, щоб активувати акаунт.</p>
                <hr style={{ margin: '20px 0' }} />
                <button
                    onClick={onBackToLogin}
                    style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Повернутися до входу
                </button>
            </div>
        </div>
    );
};

export default InfoPage;