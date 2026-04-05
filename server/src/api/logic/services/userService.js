const userRepository = require('../repositories/userRepository');

class UserService {
    async getAllUsers() {
        return await userRepository.find({
            order: { createdAt: "DESC" }
        });
    }

    async toggleUserStatus(id) {
        const user = await userRepository.findOneBy({ id });
        if (!user) throw new Error("Користувача не знайдено");

        if (user.role === 'admin') throw new Error("Неможливо змінити статус адміністратора");

        user.isActive = !user.isActive; // Інверсія статусу
        return await userRepository.save(user);
    }

    async getDebtors() {
        return await userRepository.findDebtors();
    }

    async getUserProfile(id) {
        const user = await userRepository.findOne({
            where: { id },
            relations: ["loans", "loans.book"]
        });
        if (!user) throw new Error("Профіль не знайдено");

        delete user.password;
        return user;
    }
}

module.exports = new UserService();