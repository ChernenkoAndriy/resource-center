const { DataSource } = require("typeorm");
require('dotenv').config();
const path = require('path');

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [
        path.join(__dirname, "models/*.js")
    ],
});

module.exports = { AppDataSource };