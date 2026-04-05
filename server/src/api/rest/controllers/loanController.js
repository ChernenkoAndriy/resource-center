const loanService = require('../../logic/services/loanService');

const loanController = {
    borrow: async (req, res) => {
        try {
            const loan = await loanService.createLoan(req.user.id, req.body.bookId);
            res.status(201).json(loan);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getMyLoans: async (req, res) => {
        try {
            const loans = await loanService.getUserLoans(req.user.id);
            res.json(loans);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    processReturn: async (req, res) => {
        try {
            const updatedLoan = await loanService.returnBook(req.params.id);
            res.json({ message: "Книгу успішно повернуто", updatedLoan });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    listAllLoans: async (req, res) => {
        try {
            const result = await loanService.getAllLoansWithAdvancedFilters(req.query);
            res.json({
                status: "success",
                ...result
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

    sendReminder: async (req, res) => {
        try {
            await loanService.sendLoanReminder(req.params.id);
            res.json({ status: "success", message: "Нагадування надіслано" });
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    }
};

module.exports = loanController;