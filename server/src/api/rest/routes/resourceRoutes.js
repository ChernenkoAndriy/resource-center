const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const bookController = require('../controllers/bookController');


router.get('/resources', (req, res) => {
    res.json({ message: "REST працює, ресурси знайдено" });
});

router.get('/authors', authorController.getAuthors);
router.get('/authors/:id', authorController.getAuthorById);

router.get('/books', bookController.getBooks);
router.get('/books/free', bookController.getFreeBooks);
router.get('/books/:id', bookController.getBookById);
module.exports = router;