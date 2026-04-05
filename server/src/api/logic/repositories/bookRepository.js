const { AppDataSource } = require("../data-source");
const Book = require("../models/Book");

const bookRepo = AppDataSource.getRepository(Book);

const bookRepository = AppDataSource.getRepository(Book).extend({
    async findActiveByAuthor(authorId) {
        return await this.createQueryBuilder("book")
            .where("book.authorId = :authorId", { authorId })
            .andWhere("book.isActive = :isActive", { isActive: true })
            .orderBy("book.title", "ASC")
            .getMany();
    },

    async getStatsByCategory() {
        return await this.createQueryBuilder("book")
            .select("book.category", "category")
            .addSelect("COUNT(book.id)", "count")
            .groupBy("book.category")
            .getRawMany();
    }
});

module.exports = bookRepository;