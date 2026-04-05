import { useState, useEffect } from 'react';

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
        <div style={styles.overlay}>
            <form onSubmit={handleSubmit} style={styles.modal}>
                <h3>{author ? 'Редагувати автора' : 'Додати автора'}</h3>

                <input
                    placeholder="ПІБ автора"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    style={styles.input}
                />

                <textarea
                    placeholder="Біографія"
                    value={formData.biography}
                    onChange={(e) => setFormData({...formData, biography: e.target.value})}
                    style={{ ...styles.input, height: '100px' }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} style={styles.btnCancel}>Скасувати</button>
                    <button type="submit" style={styles.btnSubmit}>Зберегти</button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
    btnSubmit: { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' },
    btnCancel: { backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }
};

export default AuthorForm;