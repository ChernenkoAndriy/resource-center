const express = require('express');
const resourceRoutes = require('./routes/resourceRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

module.exports = (app) => {
    app.use(express.json());
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/admin', adminRoutes);
    app.use('/api/v1', resourceRoutes);
    app.use('/api/v1', userRoutes);
};