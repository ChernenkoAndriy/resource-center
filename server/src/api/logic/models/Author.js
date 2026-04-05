const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Author",
    tableName: "authors",
    columns: {
        id: { primary: true, type: "int", generated: true },
        fullName: { type: "varchar", nullable: false },
        biography: { type: "text", nullable: true }
    },
    relations: {
        books: {
            type: "one-to-many",
            target: "Book",
            inverseSide: "author"
        }
    }
});