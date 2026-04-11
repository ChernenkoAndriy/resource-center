import React, { useState, useEffect } from 'react';
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
        <div className="container mt-4">
            {isFormOpen && (
                <AuthorForm
                    author={editingAuthor}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setIsFormOpen(false); setEditingAuthor(null); }}
                />
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Керування авторами</h2>
                <div>
                    <button className="btn btn-success me-2" onClick={() => setIsFormOpen(true)}>
                        <i className="bi bi-person-plus me-1"></i>Додати автора
                    </button>
                    <button className="btn btn-outline-secondary" onClick={onBack}>Назад</button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="px-4">ПІБ</th>
                            <th>Біографія</th>
                            <th className="text-end px-4">Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {authors.map(author => (
                            <tr key={author.id}>
                                <td className="px-4 fw-bold">{author.fullName}</td>
                                <td className="text-muted small">{author.biography?.substring(0, 100)}...</td>
                                <td className="text-end px-4">
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => { setEditingAuthor(author); setIsFormOpen(true); }}
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(author.id)}
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAuthorsPage;