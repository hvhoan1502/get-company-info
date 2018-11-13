const express = require('express');
const { mustBeUser } = require('./user.middleware');

const companyRouter = express.Router();

// Check token
companyRouter.use(mustBeUser);

companyRouter.get('/', (req, res ) => {
    res.render('pages/private/company');
});

module.exports = { companyRouter }