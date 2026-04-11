import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    return (
        <nav className={`navbar navbar-expand-lg mb-4 shadow-sm ${isAdmin ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
            <div className="container">
                <span className="navbar-brand fw-bold text-uppercase">
                    <i className="bi bi-book-half me-2"></i>Ресурсний Центр
                </span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {isAdmin ? (
                            <>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => navigate('/admin/books')}>Книги</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => navigate('/admin/authors')}>Автори</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => navigate('/admin/users')}>Користувачі</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => navigate('/admin/loans')}>Позики</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => navigate('/books')}>Бібліотека</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => navigate('/my-loans')}>Мої позики</button>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center">
                        <span className="navbar-text me-3">
                            <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-success'} me-2`}>{user.role}</span>
                            <strong>{user.firstName} {user.lastName}</strong>
                        </span>
                        <button className="btn btn-outline-primary btn-sm" onClick={onLogout}>Вийти</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;