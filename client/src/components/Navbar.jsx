import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    const styles = {
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: isAdmin ? '#e74c3c' : '#f1c40f',
            color: isAdmin ? 'white' : 'black',
            marginBottom: '20px'
        },
        links: { display: 'flex', gap: '15px' },
        link: {
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
        },
        logout: {
            backgroundColor: 'rgba(0,0,0,0.1)',
            border: '1px solid currentColor',
            color: 'inherit',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.links}>
                {isAdmin ? (
                    <>
                        <button style={styles.link} onClick={() => navigate('/admin/books')}>Книги</button>
                        <button style={styles.link} onClick={() => navigate('/admin/authors')}>Автори</button>
                        <button style={styles.link} onClick={() => navigate('/admin/users')}>Користувачі</button>
                        <button style={styles.link} onClick={() => navigate('/admin/loans')}>Позики</button>
                    </>
                ) : (
                    <>
                        <button style={styles.link} onClick={() => navigate('/books')}>Бібліотека</button>
                        <button style={styles.link} onClick={() => navigate('/my-loans')}>Мої позики</button>
                    </>
                )}
            </div>
            <div>
                <span style={{ marginRight: '15px' }}>{user.firstName} ({user.role})</span>
                <button style={styles.logout} onClick={onLogout}>Вийти</button>
            </div>
        </nav>
    );
};

export default Navbar;