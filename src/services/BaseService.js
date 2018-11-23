'use strict';

const request = require('request');

class BaseService {

    constructor() {

    }

    // Get all link company by page site
    static getAllLink(uri, headers) {
        let req = {
            uri,
            method: 'GET'
        }

        if (headers) {
            req.headers = headers;
        }

        return new Promise((resolve, reject) => {
            request(req, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            });
        });
    }

    // Get detail company information by link
    static getDetailCompany(uri, headers) {

        let req = {
            uri,
            method: 'GET'
        }

        if (headers) {
            req.headers = headers;
        }

        return new Promise((resolve, reject) => {
            request(req, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            });
        });
    }
}

module.exports = { BaseService }