const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Забагато спроб, спробуйте пізніше" }
});

module.exports = { authLimiter };