const express = require('express');

const { mustBeUser } = require('./user.middleware');

const companyRouter = express.Router();

// Check token
companyRouter.use(mustBeUser);

// Check body request when method is POST
companyRouter.use((req, res, next) => {
    const body = req.body;
    if (req.method === 'POST') {
        if (body.city.length === 0 || body.startPage.length === 0 || body.endPage.length === 0) {
            return res.send('Not Found!');
        }
        try {
            req.body.startPage = parseInt(body.startPage);
            req.body.endPage = parseInt(body.endPage);
            
        } catch (err) {
            return res.send('Invalid value!!!');
        }
    }
    next();
});

companyRouter.get('/', (req, res ) => {
    res.render('pages/private/company');
});

// Get thongtincongty.com information
companyRouter.get('/thongtincongty', (req, res) => {
    res.render('pages/private/thongtincongty', { data: null });
});

companyRouter.post('/thongtincongty', (req, res) => {
    const body = req.body;
    
    const data = [
        {
            name: 'ABC1',
            address: 'ABCD2',
            master: 'ABCDE3',
            phoneNumber: '01639514251',
            field: 'Hi4'
        }
    ];
    res.render('pages/private/thongtincongty', { data });
});

module.exports = { companyRouter }