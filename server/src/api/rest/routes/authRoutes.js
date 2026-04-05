const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

router.post('/register',
    authLimiter,
    [
        body('email').isEmail().withMessage('Некоректний email'),
        body('password').isLength({ min: 6 }).withMessage('Пароль має бути мін. 6 символів'),
        body('firstName').notEmpty(),
        body('lastName').notEmpty(),
    ],
    validate,
    authController.register
);

router.post('/login', authLimiter, authController.login);
router.get('/confirm', authController.confirmEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
module.exports = router;