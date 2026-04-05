const { AppDataSource } = require("./data-source");
const userRepository = require("./repositories/userRepository");
const authorRepository = require("./repositories/authorRepository");
const bookRepository = require("./repositories/bookRepository");
const loanRepository = require("./repositories/loanRepository");
const bcrypt = require("bcryptjs");

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Очищення бази даних...");

        await AppDataSource.synchronize(true);
        console.log("Базу даних очищено та перестворено.");

        const adminPassword = await bcrypt.hash("admin123", 10);
        const readerPassword = await bcrypt.hash("reader123", 10);

        const admin = userRepository.create({
            firstName: "Admin",
            lastName: "System",
            email: "admin@library.com",
            password: adminPassword,
            role: "admin",
            isEmailConfirmed: true
        });

        const reader1 = userRepository.create({
            firstName: "Andriy",
            lastName: "User",
            email: "user@example.com",
            password: readerPassword,
            role: "reader",
            isEmailConfirmed: true
        });

        const reader2 = userRepository.create({
            firstName: "Ivan",
            lastName: "Petrenko",
            email: "ivan@test.com",
            password: readerPassword,
            role: "reader",
            isEmailConfirmed: true,
            isActive: true
        });

        await userRepository.save([admin, reader1, reader2]);
        console.log("Користувачі створені");

        // 2. Створення авторів
        const author1 = authorRepository.create({
            fullName: "Тарас Шевченко",
            biography: "Український поет, художник, мислитель."
        });
        const author2 = authorRepository.create({
            fullName: "Джордж Орвелл",
            biography: "Англійський письменник, автор антиутопій."
        });

        await authorRepository.save([author1, author2]);
        console.log("Автори створені");

        // 3. Створення книг
        const book1 = bookRepository.create({
            title: "Кобзар",
            isbn: "978-966-00-1234-1",
            summary: "Збірка поетичних творів.",
            author: author1
        });

        const book2 = bookRepository.create({
            title: "1984",
            isbn: "978-0-141-03614-4",
            summary: "Роман-антиутопія про тоталітаризм.",
            author: author2
        });

        await bookRepository.save([book1, book2]);
        console.log("Книги створені");

        // 4. Створення тестових позик
        const now = new Date();

        // Активна позика (термін ще не вийшов)
        const activeLoan = loanRepository.create({
            user: reader1,
            book: book1,
            issueDate: now,
            dueDate: new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)), // +14 днів
            status: "active"
        });

        // Протермінована позика для тестів (дата повернення була в минулому)
        const overdueLoan = loanRepository.create({
            user: reader2,
            book: book2,
            issueDate: new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000)), // взято 20 днів тому
            dueDate: new Date(now.getTime() - (6 * 24 * 60 * 60 * 1000)),   // мало бути повернуто 6 днів тому
            status: "overdue"
        });

        await loanRepository.save([activeLoan, overdueLoan]);
        console.log("Тестові позики створені");

        console.log("Тестові дані успішно оновлені!");
        process.exit(0);
    } catch (error) {
        console.error("Помилка під час сідування:", error);
        process.exit(1);
    }
};

seed();