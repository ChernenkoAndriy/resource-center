const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Loan",
    tableName: "loans",
    columns: {
        id: { primary: true, type: "int", generated: true },
        issueDate: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
        dueDate: { type: "timestamp" },
        returnDate: { type: "timestamp", nullable: true },
        status: {
            type: "enum",
            enum: ["active", "returned", "overdue"],
            default: "active"
        }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE"
        },
        book: {
            type: "many-to-one",
            target: "Book",
            joinColumn: true,
            onDelete: "CASCADE"
        }
    }
});