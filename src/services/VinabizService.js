const Constants = require('../../plugins/Constants');
const _ = require('lodash');
const request = require('request');

const { BaseService } = require('./BaseService');


class VinabizService extends BaseService {
    constructor() {
        
    }

    static async getDataDetail(city, district, startPage, endPage) {
        let results = [];
        
        results = await this.getCompany();
        return results;
        
    }

    static getCompany() {
        const headers = {
            accept: 'text/css,*/*;q=0.1',
            cookie : '__cfduid=dfe568a6a781a1d2b2c03d1e04fb87fae1539162346; _ga=GA1.2.1447580105.1539162348; HstCfa2883594=1539162348477; ASP.NET_SessionId=px3hbuw2thw2oac4o2mw1nok; HstCmu2883594=1542106328631; __RequestVerificationToken=9TbGspMJu5cRrjc7N3K79-K1asOiap2xjnGJK6n_1d_mX1CI97W-A-vZkUXqSKmg1uZ3vyrnfgekcAjLL_DQezBZzNrh_YdYmrpgUh1t7DA1; _gid=GA1.2.126063930.1542877512; HstCnv2883594=3; .AspNet.ApplicationCookie=3y-H9IP6xIXH3M_wfZurRTlOkcBTMXKlbmk8IQW20ZT4SATm--swdiK93wrJUCm_zzvxhxUqhprrRM9SjUUD_diLyuUmski6sF_FizcXTYTmrVeMYpfBfAGPONHwWMKU8MtpwfHF9vDyZhjXFpHnrtmvVl_vJACCbvtQAv3W-dPmitAUUpioyFjsYLu1_zjqXx6KNZoRf8oMzbvAzR0hGV9WH29kZjCoPyxj3D2USR85YLhv7iQmCXLQ0i1KioaNvesOq8Qqcdg6ygMjoB0PXTiFFZGivQaARug0uEHbz9XgJtN6-5O2C4lRcr1w8B4iCLjftjKUB-BYvkni1LKKJDEc00XtXUSAYjVc-YXJqJmBcgX6ny7O2O-V3MdTCJtd8GLpcNCBiu1P9hks-fs5z2iaTx62SyPp6zsjmBeeWMKul_tlCUCLqcDcG3C15Iv0Nhcngsg7PoSlxvyB1j5CaaLLk_dVxfbW7ivVr7OcIlp4CdiHt6hLSkFFhFvpgmLaSROZLjKuBAgGH66wq6Nbk063-xbsm_QsXmX3me_zOco; HstCla2883594=1542881031410; HstPn2883594=4; HstPt2883594=32; HstCns2883594=6'
        };
        
        const req = {
            host: 'https://vinabiz.org',
            path: '/company/detail/cong-ty-tnhh-pangolin-viet-nam/3000330031003500330038003800350039003400',
            uri: 'https://vinabiz.org/company/detail/cong-ty-tnhh-pangolin-viet-nam/3000330031003500330038003800350039003400',
            method: 'GET',
            headers
        }
        return new Promise((resolve, reject) => {
            request(req, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            });
        })
    }
} 

module.exports = { VinabizService };