
const { AppDataSource } = require("../data-source");
const Loan = require("../models/Loan");
const { LessThan } = require("typeorm");

const loanRepository = AppDataSource.getRepository(Loan).extend({
    findOverdueLoans() {
        return this.find({
            where: {
                status: "active",
                dueDate: LessThan(new Date()),
                returnDate: null
            },
            relations: ["user", "book"]
        });
    },
    findByUser(userId) {
        return this.find({
            where: { user: { id: userId } },
            order: { issueDate: "DESC" },
            relations: ["book"]
        });
    }
});

module.exports = loanRepository;