const jwt = require('jsonwebtoken');

const SECRET_KEY = 'helloworld';

function sign(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, SECRET_KEY, { expiresIn: 6000}, (error, token) => {
            if(error) return reject(error);
            resolve(token);
        });
    });
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (error, obj) => {
            if(error) return null ;
            delete obj.exp;
            delete obj.iat;
            resolve(obj);
        });
    });
}

module.exports = { sign, verify };