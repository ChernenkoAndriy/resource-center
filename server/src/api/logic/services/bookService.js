const bookRepository = require('../repositories/bookRepository');

const bookService = {
    async getAllBooks(params = {}) {
        // Додаємо дефолтні значення для сортування
        const { title, authorName, sort = 'title', order = 'ASC' } = params;

        const query = bookRepository.createQueryBuilder("book")
            .leftJoinAndSelect("book.author", "author");

        // Серверний пошук за назвою
        if (title) {
            query.andWhere("book.title ILIKE :title", { title: `%${title}%` });
        }

        // Серверний пошук за автором
        if (authorName) {
            query.andWhere("author.fullName ILIKE :authorName", { authorName: `%${authorName}%` });
        }

        // Динамічне сортування на рівні БД
        const validSortFields = ['title', 'isbn', 'isActive'];
        const sortField = validSortFields.includes(sort) ? `book.${sort}` : 'book.title';
        query.orderBy(sortField, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

        return await query.getMany();
    },

    async getAvailableBooks(params = {}) {
        const { title, authorName, sort = 'title', order = 'ASC' } = params;

        const query = bookRepository.createQueryBuilder("book")
            .leftJoinAndSelect("book.author", "author")
            .leftJoin("book.loans", "loan", "loan.status IN (:...activeStatuses)", {
                activeStatuses: ['active', 'overdue']
            })
            .where("book.isActive = :isActive", { isActive: true })
            .andWhere("loan.id IS NULL"); // Тільки ті, що не в оренді

        if (title) {
            query.andWhere("book.title ILIKE :title", { title: `%${title}%` });
        }

        if (authorName) {
            query.andWhere("author.fullName ILIKE :authorName", { authorName: `%${authorName}%` });
        }

        query.orderBy(`book.${sort}`, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

        return await query.getMany();
    },
    async getBookById(id) {
        const book = await bookRepository.findOne({
            where: { id },
            relations: ["author"]
        });
        if (!book) throw new Error("Книгу не знайдено");
        return book;
    },

    async createBook(data) {
        const book = bookRepository.create(data);
        return await bookRepository.save(book);
    },

    async updateBook(id, data) {
        await this.getBookById(id);
        await bookRepository.update(id, data);
        return await this.getBookById(id);
    },

    async softDeleteToggle(id) {
        const book = await this.getBookById(id);
        book.isActive = !book.isActive; // Інверсія поточного стану
        return await bookRepository.save(book);
    },

    async hardDelete(id) {
        const book = await this.getBookById(id);
        return await bookRepository.remove(book);
    }
};

module.exports = bookService;