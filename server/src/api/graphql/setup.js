const { ApolloServer, HeaderMap } = require('@apollo/server');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = async (app) => {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.use('/graphql', bodyParser.json(), async (req, res) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        let user = null;

        if (token) {
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                console.warn("GraphQL: Невалідний токен");
            }
        }

        const headers = new HeaderMap();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
                headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
        }

        try {
            const response = await server.executeHTTPGraphQLRequest({
                httpGraphQLRequest: {
                    method: req.method,
                    headers: headers,
                    search: req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '',
                    body: req.body,
                },
                context: async () => ({ user }),
            });

            res.status(response.status || 200);

            if (response.headers) {
                for (const [key, value] of response.headers) {
                    res.setHeader(key, value);
                }
            }

            // ВИПРАВЛЕННЯ ТУТ: в Apollo 4 дані лежать у response.body.string!
            if (response.body.kind === 'complete') {
                res.setHeader('Content-Type', 'application/json');
                res.send(response.body.string);
            } else {
                res.json({ errors: [{ message: "Непідтримуваний формат відповіді GraphQL" }] });
            }
        } catch (error) {
            console.error("Apollo Execution Error:", error);
            res.status(500).json({ errors: [{ message: error.message }] });
        }
    });

    console.log("🚀 GraphQL Server ready at /graphql");
};