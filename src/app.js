const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MyMusic = require('../plugins/MyMusic');
const cookieParser = require('cookie-parser')
const { User } = require('./models/User.model');

// Require router files
const { companyRouter } = require('./controllers/company.router');
const { memoryrouter } = require('./controllers/memory.router');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('common'));

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie
app.use(cookieParser())

app.use((req, res, next) => {
    res.onError = error => res.status(error.statusCode || 500).send({
        success: false,
        message: error.message,
        code: error.code
    });
    if (req.cookies.authorization && req.cookies.name) {
        res.locals.user = {
            name: req.cookies.name
        }
    }
    next();
});

// Run index pages
app.get('/', ( req, res ) => {
    res.render('pages/public/index');
});

// Login page
app.get('/login', (req, res) => {
    res.render('pages/public/login', { error: null });
});

//Login method post and redirect
app.post('/login', (req, res) => {
    const data = req.body;
    if (!data.name || !data.password) {
        const error = {
            success: false,
            message: 'Invalid infomation.'
        }
        res.redirect('pages/public/login', { error });
    }
    User.login(data.name, data.password)
    .then(result => {
        res.cookie('authorization', result.data.token);
        res.cookie('name', result.data.name);
        res.locals.user = result.data;
        res.render('pages/public/index');
    })
    .catch(err => {
        const error = {
            message: err.message
        }
        res.render('pages/public/login', { error });
    });
});

//Logout
app.get('/logout', (req, res) => {
    res.clearCookie('authorization');
    res.clearCookie('name');
    delete res.locals.user;
    res.render('pages/public/index');
});

app.get('/music', (req, res) => {
    const listMusic = MyMusic.listMusic;
    res.render('pages/public/music', { listMusic });
});

// Company router
app.use('/company',companyRouter);
// Memory royter
app.use('/memory', memoryrouter);


// End
app.use((error, req, res, next) => {
    res.status(500).send({
        success: false,
        message: error.message
    });
});


module.exports = { app };