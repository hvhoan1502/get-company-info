
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Require router files
const { companyRouter } = require('./controllers/company.router');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('common'));

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.onError = error => res.status(error.statusCode || 500).send({
        success: false,
        message: error.message,
        code: error.code
    });
    next();
});

// Run index pages
app.get('/', ( req, res ) => {
    res.render('pages/index');
});

// User router
app.use('/company',companyRouter);

app.use((error, req, res, next) => {
    res.status(500).send({
        success: false,
        message: error.message
    });
});


module.exports = { app };