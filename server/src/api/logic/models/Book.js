const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Book",
    tableName: "books",
    columns: {
        id: { primary: true, type: "int", generated: true },
        title: { type: "varchar", nullable: false },
        isbn: { type: "varchar", unique: true },
        summary: { type: "text", nullable: true },
        isActive: { type: "boolean", default: true },
        authorId: { type: "int", nullable: false }
    },
    relations: {
        author: {
            type: "many-to-one",
            target: "Author",
            joinColumn: { name: "authorId" },
            onDelete: "RESTRICT"
        },
        loans: {
            type: "one-to-many",
            target: "Loan",
            inverseSide: "book"
        }
    }
});