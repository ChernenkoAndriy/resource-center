import React, { useState, useEffect } from 'react';

const BookForm = ({ book, authors, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '', authorId: '', isbn: '', description: '', publishedYear: ''
    });

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                authorId: book.author?.id || '',
                isbn: book.isbn || '',
                description: book.description || '',
                publishedYear: book.publishedYear || ''
            });
        }
    }, [book]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <form onSubmit={handleSubmit} className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">{book ? 'Редагувати книгу' : 'Додати нову книгу'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-bold">Назва книги</label>
                                <input
                                    className="form-control"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">ISBN</label>
                                <input
                                    className="form-control"
                                    value={formData.isbn}
                                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Автор</label>
                                <select
                                    className="form-select"
                                    value={formData.authorId}
                                    onChange={(e) => setFormData({...formData, authorId: e.target.value})}
                                    required
                                >
                                    <option value="">Оберіть автора...</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Рік видання</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.publishedYear}
                                    onChange={(e) => setFormData({...formData, publishedYear: e.target.value})}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Опис</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 bg-light">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Закрити</button>
                        <button type="submit" className="btn btn-primary px-4">Зберегти зміни</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;