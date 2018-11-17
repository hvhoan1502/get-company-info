const express = require('express');
const { mustBeUser } = require('./user.middleware');

const memoryrouter = express.Router();

memoryrouter.use(mustBeUser);

memoryrouter.get('/', (req, res) => {
    res.render('pages/private/memory');
});


module.exports = {
    memoryrouter
}