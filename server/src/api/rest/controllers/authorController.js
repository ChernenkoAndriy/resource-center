const authorService = require('../../logic/services/authorService');

const authorController = {
    getAuthors: async (req, res) => {
        try {
            const { sort } = req.query;
            const authors = await authorService.getAllAuthors(sort);
            res.json(authors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAuthorById: async (req, res) => {
        try {
            const author = await authorService.getAuthorById(req.params.id);
            res.json(author);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const newAuthor = await authorService.createAuthor(req.body);
            res.status(201).json(newAuthor);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const updated = await authorService.updateAuthor(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await authorService.deleteAuthor(req.params.id);
            res.json({ message: "Автора видалено" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = authorController;