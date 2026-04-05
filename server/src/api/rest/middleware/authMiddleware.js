const jwt = require('jsonwebtoken');
const userRepository = require('../../logic/repositories/userRepository');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Токен відсутній" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Невалідний або прострочений токен" });

        req.user = user;
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Недостатньо прав для цієї дії" });
        }
        next();
    };
};

const checkUserStatus = async (req, res, next) => {
    const user = await userRepository.findOneBy({ id: req.user.id });
    if (!user || !user.isActive) {
        return res.status(403).json({ message: "Ваш аккаунт заблоковано або видалено" });
    }
    next();
};

module.exports = { authenticateToken, authorizeRoles, checkUserStatus };