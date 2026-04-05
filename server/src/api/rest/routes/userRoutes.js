const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticateToken } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.use(authenticateToken);

router.post('/loans', loanController.borrow);
router.get('/loans/my', loanController.getMyLoans);

router.get('/me', userController.getMe);
module.exports = router;