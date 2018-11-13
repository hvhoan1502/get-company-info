const jwt = require('jsonwebtoken');

function mustBeUser(req, res, next ) {
    if(!req.cookies.authorization) {
        return res.render('pages/public/login', { error: null });
    }
    const token = req.cookies.authorization;
    const payload = jwt.verify(token, 'helloworld', (err, obj) => {
        if(err) return null;
        return obj;
    });
    if(!payload) return res.render('pages/public/login', { error: null });
    const { _id } = payload;
    req.idUser = _id;
    next();
}

module.exports = { mustBeUser };