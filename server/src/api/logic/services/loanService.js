const loanRepository = require('../repositories/loanRepository');
const bookRepository = require('../repositories/bookRepository');
const userRepository = require('../repositories/userRepository');
const { applyFilters } = require('../../rest/utils/queryHelper');

const loanService = {
    async createLoan(userId, bookId, days = 14) {
        const book = await bookRepository.findOne({ where: { id: bookId, isActive: true } });
        if (!book) throw new Error("Книга недоступна для займу");

        const activeLoan = await loanRepository.findOne({
            where: { book: { id: bookId }, status: "active" }
        });
        if (activeLoan) throw new Error("Книга вже на руках у іншого читача");

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        const loan = loanRepository.create({
            user: { id: userId },
            book: { id: bookId },
            dueDate,
            status: "active"
        });

        return await loanRepository.save(loan);
    },

    async returnBook(loanId) {
        const loan = await loanRepository.findOne({ where: { id: loanId }, relations: ["book"] });
        if (!loan) throw new Error("Запис про займ не знайдено");
        if (loan.status === "returned") throw new Error("Книгу вже було повернуто раніше");

        loan.returnDate = new Date();
        loan.status = "returned";

        return await loanRepository.save(loan);
    },

    async getUserLoans(userId) {
        return await loanRepository.findByUser(userId);
    },

    async getAllLoans(filters = {}) {
        const query = loanRepository.createQueryBuilder("loan")
            .leftJoinAndSelect("loan.user", "user")
            .leftJoinAndSelect("loan.book", "book");

        if (filters.status) {
            query.andWhere("loan.status = :status", { status: filters.status });
        }

        return await query.getMany();
    },

    async getAllLoansWithAdvancedFilters(queryParams) {
        const { status, title, email, page = 1, limit = 10 } = queryParams;

        const query = loanRepository.createQueryBuilder("loan")
            .leftJoinAndSelect("loan.book", "book")
            .leftJoinAndSelect("loan.user", "user");

        if (status) {
            query.andWhere("loan.status = :status", { status });
        }
        if (title) {
            query.andWhere("book.title ILIKE :title", { title: `%${title}%` });
        }
        if (email) {
            query.andWhere("user.email ILIKE :email", { email: `%${email}%` });
        }

        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);
        query.orderBy("loan.issueDate", "DESC");

        const [items, total] = await query.getManyAndCount();

        return {
            items,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async sendLoanReminder(loanId) {
        const loan = await loanRepository.findOne({
            where: { id: loanId },
            relations: ["user", "book"]
        });

        if (!loan) throw new Error("Позику не знайдено");
        if (loan.status !== 'overdue') throw new Error("Ця позика не є протермінованою");

        await emailService.sendOverdueReminder(loan.user.email, loan.book.title, loan.dueDate);
        return true;
    }

};

module.exports = loanService;