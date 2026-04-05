import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/public/login/LoginPage.jsx";
import RegisterPage from "./pages/public/login/RegisterPage.jsx";
import InfoPage from "./pages/public/login/InfoPage.jsx";
import ForgotPasswordPage from "./pages/public/login/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/public/login/ResetPasswordPage.jsx";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage.jsx";
import AdminLoansPage from "./pages/admin/loans/AdminLoansPage.jsx";
import AdminBooksPage from "./pages/admin/books/AdminBooksPage.jsx";
import AdminAuthorsPage from "./pages/admin/authors/AdminAuthorsPage.jsx";
import UserBooksPage from "./pages/user/books/UserBooksPage.jsx";
import UserLoansPage from "./pages/user/loans/UserLoansPage.jsx";
import BookDetailsPage from "./pages/user/details/BookDetailsPage.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('token') && location.pathname !== '/reset-password') {
            navigate(`/reset-password?token=${urlParams.get('token')}`);
        }

        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);

            if (location.pathname === '/') {
                navigate(parsedUser.role === 'admin' ? '/admin/books' : '/books');
            }
        }
        setIsInitialized(true);
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        // Нові редіректи після логіну
        navigate(userData.role === 'admin' ? '/admin/books' : '/books');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    if (!isInitialized) return null;

    return (
        <>
            {user && <Navbar user={user} onLogout={handleLogout} />}

            <Routes>
                <Route path="/login" element={
                    !user ? <LoginPage
                            onSwitch={() => navigate('/register')}
                            onLoginSuccess={handleLoginSuccess}
                            onForgot={() => navigate('/forgot-password')}
                        />
                        : <Navigate to={user.role === 'admin' ? '/admin/books' : '/books'} />
                } />
                <Route path="/register" element={<RegisterPage onSwitch={() => navigate('/login')} onSuccess={() => navigate('/info')} />} />
                <Route path="/info" element={<InfoPage onBackToLogin={() => navigate('/login')} />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage onBack={() => navigate('/login')} />} />
                <Route path="/reset-password" element={<ResetPasswordPage onComplete={() => navigate('/login')} />} />

                <Route path="/admin/books" element={
                    user && user.role === 'admin' ? <AdminBooksPage /> : <Navigate to="/login" />
                } />
                <Route path="/admin/authors" element={
                    user && user.role === 'admin' ? <AdminAuthorsPage /> : <Navigate to="/login" />
                } />
                <Route path="/admin/users" element={
                    user && user.role === 'admin' ? <AdminUsersPage /> : <Navigate to="/login" />
                } />
                <Route path="/admin/loans" element={
                    user && user.role === 'admin' ? <AdminLoansPage /> : <Navigate to="/login" />
                } />

                <Route path="/books" element={
                    user ? <UserBooksPage /> : <Navigate to="/login" />
                } />
                <Route path="/books/:id" element={
                    user ? <BookDetailsPage /> : <Navigate to="/login" />
                } />
                <Route path="/my-loans" element={
                    user ? <UserLoansPage /> : <Navigate to="/login" />
                } />

                <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/books' : '/books') : "/login"} />} />
            </Routes>
        </>
    );
}

export default App;