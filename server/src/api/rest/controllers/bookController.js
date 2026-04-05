const bookService = require('../../logic/services/bookService');

const bookController = {
        getBooks: async (req, res) => {
            try {
                const books = await bookService.getAllBooks(req.query);
                res.json(books);
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        },

        create: async (req, res) => {
            try {
                const book = await bookService.createBook(req.body);
                res.status(201).json(book);
            } catch (error) {
                res.status(400).json({message: error.message});
            }
        },

        toggleStatus: async (req, res) => {
            try {
                const book = await bookService.softDeleteToggle(req.params.id);
                res.json({message: "Статус книги змінено", book});
            } catch (error) {
                res.status(400).json({message: error.message});
            }
        },

        remove: async (req, res) => {
            try {
                await bookService.hardDelete(req.params.id);
                res.json({message: "Книгу видалено остаточно"});
            } catch (error) {
                res.status(400).json({message: error.message});
            }
        },

        getBookById: async (req, res) => {
            try {
                const {id} = req.params;
                const book = await bookService.getBookById(id);
                res.json(book);
            } catch (error) {
                if (error.message === "Книгу не знайдено") {
                    return res.status(404).json({message: error.message});
                }
                res.status(500).json({message: "Помилка сервера при отриманні книги"});
            }
        },

        update:
            async (req, res) => {
                try {
                    const {id} = req.params;
                    const updatedBook = await bookService.updateBook(id, req.body);
                    res.json(updatedBook);
                } catch (error) {
                    if (error.message === "Книгу не знайдено") {
                        return res.status(404).json({message: error.message});
                    }
                    res.status(400).json({message: error.message});
                }
            },
    getFreeBooks: async (req, res) => {
        try {
            const books = await bookService.getAvailableBooks(req.query);
            res.json(books);
        } catch (error) {
            res.status(500).json({
                message: "Помилка сервера при отриманні списку вільних книг",
                error: error.message
            });
        }
    }
    }
;

module.exports = bookController;