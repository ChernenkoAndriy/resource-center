const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const authorController = require('../controllers/authorController');
const bookController = require('../controllers/bookController');
const loanController = require('../controllers/loanController');
const userController = require('../controllers/userController');

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.patch('/users/:id/block', (req, res) => {
    res.json({ message: `Користувача ${req.params.id} заблоковано` });
});


router.post('/authors', authorController.create);
router.put('/authors/:id', authorController.update);
router.delete('/authors/:id', authorController.delete);

router.post('/books', bookController.create);
router.put('/books/:id', bookController.update);
router.patch('/books/:id/status', bookController.toggleStatus);
router.delete('/books/:id', bookController.remove);

router.get('/loans', loanController.listAllLoans);
router.patch('/loans/:id/return', loanController.processReturn);
router.post('/loans/:id/remind', loanController.sendReminder);

router.get('/users', userController.getAll);
router.patch('/users/:id/toggle-status', userController.toggleStatus);
router.get('/users/debtors', userController.getDebtors);

module.exports = router;