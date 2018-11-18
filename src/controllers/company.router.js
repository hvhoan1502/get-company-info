const express = require('express');

const { ThongTinCongTyService } = require('../services/ThongtincongtyService');
const dataList = require('../../plugins/Info.json');

const { mustBeUser } = require('./user.middleware');

const companyRouter = express.Router();

// Check token
companyRouter.use(mustBeUser);

// Check body request when method is POST
companyRouter.use((req, res, next) => {
    const body = req.body;
    const dataInfo = dataList;
    let allow = true;
    if (req.method === 'POST') {
        if (body.city.length === 0 || body.startPage.length === 0 || body.endPage.length === 0) {
            allow = false;
        }
        try {
            req.body.startPage = parseInt(body.startPage);
            req.body.endPage = parseInt(body.endPage);
            if (req.body.startPage > req.body.endPage) {
                allow = false;
            }
            
        } catch (err) {
            allow = false;
        }
    }
    if (!allow) {
        const data = {
            message: "Failled Action. Check enter information."
        }
        return res.render('pages/private/thongtincongty', { data, header: {}, dataInfo });
    }
    next();
});

companyRouter.get('/', (req, res ) => {
    res.render('pages/private/company');
});

// Get thongtincongty.com information
companyRouter.get('/thongtincongty', (req, res) => {
    const dataInfo = dataList;
    res.render('pages/private/thongtincongty', { data: null, header: {}, dataInfo });
});

companyRouter.post('/thongtincongty', (req, res) => {
    const dataInfo = dataList;
    const body = req.body;
    const header = Object.assign({},
        ({ city: body.city } || {}),
        ({ district: body.district } || {}),
        ({ startPage: body.startPage } || {}),   
        ({ endPage: body.endPage } || {}) 
    );

    ThongTinCongTyService.getDataDetail( body.city, body.district, body.startPage, body.endPage )
    .then(data => res.render('pages/private/thongtincongty', { header, data, dataInfo }))
    .catch(err => res.send(err));
});

module.exports = { companyRouter }