const { AppDataSource } = require("../data-source");
const User = require("../models/User");

const userRepository = AppDataSource.getRepository(User).extend({
    async findByEmail(email) {
        return await this.findOne({
            where: { email: email.toLowerCase() }
        });
    },

    async findDebtors() {
        return await this.createQueryBuilder("user")
            .innerJoin("user.loans", "loan")
            .where("loan.status = :status", { status: "overdue" })
            .andWhere("loan.returnDate IS NULL")
            .getMany();
    }
});

module.exports = userRepository;