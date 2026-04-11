const userRepository = require('../repositories/userRepository');

class UserService {
    async getAllUsers(params = {}) {
        const { search } = params;
        const query = userRepository.createQueryBuilder("user");

        if (search) {
            query.where("user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search",
                { search: `%${search}%` });
        }

        query.orderBy("user.createdAt", "DESC");
        return await query.getMany();
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