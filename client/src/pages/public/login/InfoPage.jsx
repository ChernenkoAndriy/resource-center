import React from 'react';

const InfoPage = ({ onBackToLogin }) => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow border-0 text-center">
                        <div className="card-body p-5">
                            <div className="mb-4">
                                <i className="bi bi-envelope-check text-success" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h2 className="card-title fw-bold mb-3">Майже готово! 📧</h2>
                            <p className="text-muted mb-4">
                                Ми надіслали лист для підтвердження на вашу електронну адресу.
                                Будь ласка, перевірте пошту (та папку <strong>Спам</strong>) і натисніть на посилання у листі, щоб активувати акаунт.
                            </p>
                            <hr className="my-4" />
                            <button
                                onClick={onBackToLogin}
                                className="btn btn-primary btn-lg w-100 shadow-sm"
                            >
                                Повернутися до входу
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;