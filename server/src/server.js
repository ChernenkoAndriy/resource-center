require('reflect-metadata');
require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./api/logic/data-source');
const setupRestApi = require('./api/rest/setup');
const setupGraphqlApi = require('./api/graphql/setup');
const helmet = require('helmet');
const cors = require('cors');
const cronService = require('./api/logic/services/cronService');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
const API_MODE = process.env.VITE_API_MODE;

AppDataSource.initialize()
    .then(async () => {
        console.log("✅ База даних підключена");
        cronService.init();
        if (API_MODE === 'REST') {
            setupRestApi(app);
            console.log("Працюємо в режимі REST API");
        } else {
            await setupGraphqlApi(app);
            console.log("Працюємо в режимі GRAPHQL API");
        }

        app.listen(process.env.PORT, () => {
            console.log(`Сервер на http://localhost:${process.env.PORT}`);
        });
    })
    .catch(error => console.log("Помилка:", error));