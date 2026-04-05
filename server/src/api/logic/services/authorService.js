const authorRepository = require('../repositories/authorRepository');

const authorService = {
    async getAllAuthors(sortName = 'ASC') {
        return await authorRepository.find({
            order: { fullName: sortName }
        });
    },

    async getAuthorById(id) {
        const author = await authorRepository.findOne({
            where: { id },
            relations: ["books"]
        });
        if (!author) throw new Error("Автор не знайдений");
        return author;
    },

    async createAuthor(data) {
        const author = authorRepository.create(data);
        return await authorRepository.save(author);
    },

    async updateAuthor(id, data) {
        await this.getAuthorById(id);
        await authorRepository.update(id, data);
        return await this.getAuthorById(id);
    },

    async deleteAuthor(id) {
        const author = await this.getAuthorById(id);
        return await authorRepository.remove(author);
    }
};

module.exports = authorService;