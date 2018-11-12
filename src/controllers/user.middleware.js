const jwt = require('jsonwebtoken');

function mustBeUser (req, res, next ) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request.');
    }
    const token = req.headers.authorization;
    const payload = jwt.verify(token, 'helloworld', (err, obj) => {
        if(err) return null;
        return obj;
    });
    if(!payload) return res.status(401).send('Unauthorized request.');
    const { _id } = payload;
    req.idUser = _id;
    next();
}

module.exports = { mustBeUser };