const request = require('request');

class BaseService {
    // Get all link company by page site
    getAllLink(uri) {
        return new Promise((resolve, reject) => {
            request(uri, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            });
        });
    }

    // Get detail company information by link
    getDetailCompany(uri) {
        return new Promise((resolve, reject) => {
            request(uri, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            })
        });
    }
}

module.exports = { BaseService }