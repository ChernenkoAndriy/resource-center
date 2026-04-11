import React, { useState, useEffect } from 'react';

const AuthorForm = ({ author, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        biography: ''
    });

    useEffect(() => {
        if (author) {
            setFormData({
                fullName: author.fullName || '',
                biography: author.biography || ''
            });
        }
    }, [author]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <form onSubmit={handleSubmit} className="modal-content border-0 shadow-lg">
                    <div className="modal-header">
                        <h5 className="modal-title">{author ? 'Редагувати автора' : 'Додати автора'}</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label">ПІБ автора</label>
                            <input
                                className="form-control"
                                placeholder="Наприклад: Тарас Шевченко"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-0">
                            <label className="form-label">Біографія</label>
                            <textarea
                                className="form-control"
                                placeholder="Коротка інформація про автора"
                                value={formData.biography}
                                onChange={(e) => setFormData({...formData, biography: e.target.value})}
                                rows="5"
                            />
                        </div>
                    </div>
                    <div className="modal-footer bg-light border-0">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Скасувати</button>
                        <button type="submit" className="btn btn-success px-4">Зберегти</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthorForm;