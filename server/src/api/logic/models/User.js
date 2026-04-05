// src/api/logic/models/User.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: { primary: true, type: "int", generated: true },
        firstName: { type: "varchar", nullable: false },
        lastName: { type: "varchar", nullable: false },
        email: { type: "varchar", unique: true, nullable: false },
        password: { type: "varchar", nullable: false },
        role: { type: "enum", enum: ["admin", "reader"], default: "reader" },
        isActive: { type: "boolean", default: true },
        isEmailConfirmed: { type: "boolean", default: false },
        confirmationToken: { type: "varchar", nullable: true },
        createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
        resetPasswordToken: { type: "varchar", nullable: true },
        resetPasswordExpires: { type: "timestamp", nullable: true }
    },
    relations: {
        loans: {
            type: "one-to-many",
            target: "Loan",
            inverseSide: "user"
        }
    }
});