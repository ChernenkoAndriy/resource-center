const userRepository = require('../../logic/repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../../logic/services/emailService');
const { MoreThan } = require("typeorm");

const authController = {
    register: async (req, res) => {
        const { email, password, firstName, lastName } = req.body;

        try {
            const existing = await userRepository.findByEmail(email);
            if (existing) return res.status(400).json({ message: "Email вже зайнятий" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const confirmationToken = crypto.randomBytes(32).toString('hex');
            await emailService.sendConfirmationEmail(email, confirmationToken);

            const newUser = userRepository.create({
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                role: 'reader',
                confirmationToken,
                isEmailConfirmed: false
            });

            await userRepository.save(newUser);
            res.status(201).json({ message: "Користувача створено. Перевірте пошту для підтвердження." });

        } catch (error) {
            console.error("Помилка реєстрації:", error);
            res.status(500).json({
                message: "Не вдалося надіслати лист підтвердження. Реєстрація скасована.",
                error: error.message
            });
        }
    },

    confirmEmail: async (req, res) => {
        const { token } = req.query;
        if (!token) return res.status(400).json({ message: "Токен відсутній" });

        const user = await userRepository.findOne({ where: { confirmationToken: token } });
        if (!user) return res.status(400).json({ message: "Невалідний токен" });

        user.isEmailConfirmed = true;
        user.confirmationToken = null; // Видаляємо токен після використання
        await userRepository.save(user);

        res.send("<h1>Пошту успішно підтверджено! Тепер ви можете увійти в систему.</h1>");
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Невірні дані" });
        }

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Ви заблоковані" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) return res.status(404).json({ message: "Користувача з таким email не знайдено" });

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 година

            await userRepository.save(user);

            try {
                await emailService.sendPasswordResetEmail(user.email, resetToken);
                res.json({ message: "Інструкції надіслано на пошту" });
            } catch (mailError) {
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                await userRepository.save(user);
                throw new Error("Не вдалося надіслати лист. Спробуйте пізніше.");
            }

        } catch (error) {
            res.status(500).json({ message: error.message || "Помилка сервера" });
        }
    },

    resetPassword: async (req, res) => {
        const { token, password } = req.body;

        try {
            const user = await userRepository.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: MoreThan(new Date())
                }
            });
            if (!user) {
                return res.status(400).json({
                    message: "Токен невалідний або його термін дії (1 година) закінчився"
                });
            }
            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await userRepository.save(user);

            res.json({ message: "Пароль успішно змінено! Тепер ви можете увійти." });
        } catch (error) {
            console.error("RESET PASSWORD ERROR:", error);
            res.status(500).json({
                message: "Помилка сервера при оновленні пароля",
                error: error.message
            });
        }
    }
};

module.exports = authController;