import { useState, useEffect } from 'react';
import authorService from '../../../services/authorService';
import AuthorForm from './AuthorForm';

const AdminAuthorsPage = ({ onBack }) => {
    const [authors, setAuthors] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadAuthors(); }, []);

    const loadAuthors = async () => {
        setLoading(true);
        try {
            const data = await authorService.getAllAuthors();
            setAuthors(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingAuthor) {
                await authorService.updateAuthor(editingAuthor.id, formData);
            } else {
                await authorService.createAuthor(formData);
            }
            setIsFormOpen(false);
            setEditingAuthor(null);
            loadAuthors();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Видалити автора?')) {
            try {
                await authorService.deleteAuthor(id);
                loadAuthors();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {isFormOpen && (
                <AuthorForm
                    author={editingAuthor}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setIsFormOpen(false); setEditingAuthor(null); }}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Керування авторами</h2>
                <div>
                    <button onClick={() => setIsFormOpen(true)} style={styles.btnAdd}>+ Додати автора</button>
                    <button onClick={onBack} style={{ marginLeft: '10px' }}>Назад</button>
                </div>
            </div>

            {loading ? <p>Завантаження...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={styles.th}>ПІБ</th>
                        <th style={styles.th}>Біографія</th>
                        <th style={styles.th}>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {authors.map(author => (
                        <tr key={author.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={styles.td}>{author.fullName}</td>
                            <td style={styles.td}>{author.biography?.substring(0, 50)}...</td>
                            <td style={styles.td}>
                                <button onClick={() => { setEditingAuthor(author); setIsFormOpen(true); }} style={styles.btnEdit}>Редагувати</button>
                                <button onClick={() => handleDelete(author.id)} style={styles.btnDelete}>Видалити</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '12px', borderBottom: '2px solid #ddd' },
    td: { padding: '12px' },
    btnAdd: { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' },
    btnEdit: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer' },
    btnDelete: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

export default AdminAuthorsPage;