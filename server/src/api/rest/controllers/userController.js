const userService = require('../../logic/services/userService');

const userController = {
    getAll: async (req, res) => {
        try {
            const users = await userService.getAllUsers(req.query);
            res.json({ status: "success", data: users });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

    toggleStatus: async (req, res) => {
        try {
            const user = await userService.toggleUserStatus(req.params.id);
            res.json({
                status: "success",
                message: user.isActive ? "Користувача розблоковано" : "Користувача заблоковано",
                data: user
            });
        } catch (error) {
            const statusCode = error.message.includes("знайдено") ? 404 : 400;
            res.status(statusCode).json({ status: "error", message: error.message });
        }
    },

    getDebtors: async (req, res) => {
        try {
            const debtors = await userService.getDebtors();
            res.json({ status: "success", count: debtors.length, data: debtors });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Помилка при отриманні списку боржників" });
        }
    },

    getMe: async (req, res) => {
        try {
            const profile = await userService.getUserProfile(req.user.id);
            res.json({ status: "success", data: profile });
        } catch (error) {
            res.status(404).json({ status: "error", message: error.message });
        }
    }
};

module.exports = userController;