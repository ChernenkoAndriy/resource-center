const { AppDataSource } = require("../data-source");
const Author = require("../models/Author");

const authorRepository = AppDataSource.getRepository(Author).extend({
    async findAuthorsWithBookCount() {
        return this.createQueryBuilder("author")
            .leftJoinAndSelect("author.books", "book")
            .loadRelationCountAndMap("author.booksCount", "author.books")
            .getMany();
    }
});

module.exports = authorRepository;