'use strict';

const { BaseService } = require('./BaseService');
const Constants = require('../../plugins/Constants');


class ThuongHieuToanCauService extends BaseService {
    constructor() {
        
    }

    static async getDataDetail(city, startPage, endPage) {
        let results = [];
        for (let i = startPage; i <= endPage; i++) {
            const location = this.defineLocationByName(city);
            const uri = `${Constants.UrlSite.ThuongHieuToanCau}${location}&begin=&end=&p=${i}`;
            try {
                let body = await this.getAllLink(uri);
                let firstIndex = body.indexOf('<div class="list-info-c">');
                let lastIndex = body.indexOf('<div class="page"><a');
                body = body.substring(firstIndex + 15, lastIndex);
                body = body.split('<div class="list-info-c">');
                for (let item = 0; item < body.length; item++) {
                    const link = this.splitItemLink(body[item]);
                    let data = await this.getDetailCompany(link);
                    firstIndex = data.indexOf('<div class="company-info">');
                    lastIndex = data.indexOf('<div class="sys_mess postion_ads_detail">');
                    data = data.substring(firstIndex, lastIndex);

                    // Date Allow active
                    const firstIndexDate = data.indexOf('lập:');
                    let dateAllow = data.substring(firstIndexDate + 14, firstIndexDate + 24);
                    if (dateAllow.includes('/')) {
                        dateAllow = null;
                    }

                    // name
                    const firstIndexName = data.indexOf('<h1>');
                    const lastIndexName = data.indexOf('</h1>');
                    const name = data.substring(firstIndexName + 4, lastIndexName);
                    // address
                    const firstIndexAddress = data.indexOf('<h2>');
                    const lastIndexAddress = data.indexOf('</h2>');
                    const address = data.substring(firstIndexAddress + 4, lastIndexAddress);
                    // master
                    let cutBodyIndex = data.indexOf('GĐ/Chủ/Đại diện');
                    data = data.substring(cutBodyIndex);
                    const firstIndexMaster = data.indexOf('</strong>');
                    const lastIndexMaster = data.indexOf('</p>');
                    const master = data.substring(firstIndexMaster + 9, lastIndexMaster);
                    // phone number
                    cutBodyIndex = data.indexOf('Di động:');
                    data = data.substring(cutBodyIndex);
                    const firstIndexPhone = data.indexOf('</strong>');
                    const lastIndexPhone = data.indexOf('</p>');
                    const phoneNumber = data.substring(firstIndexPhone + 9, lastIndexPhone);
                    // field
                    cutBodyIndex = data.indexOf('Lĩnh vực hoạt động:');
                    data = data.substring(cutBodyIndex);
                    const firstIndexField = data.indexOf('</strong>');
                    const lastIndexField = data.indexOf('</p>');
                    const field = data.substring(firstIndexField + 9, lastIndexField);
                    if (phoneNumber) {
                        results.push({name, address, master, phoneNumber, field, dateAllow});
                    }
                }
            } catch(err) {
                console.log(err);
            }
        }
        return results;
    }

    static defineLocationByName(name) {
        if (name == 'thanh-pho-ho-chi-minh') {
            return 14;
        } else if (name == 'tinh-ben-tre') {
            return 4;
        } else if (name == 'tinh-dong-nai') {
            return 29;
        } else {
            return 10;
        }
    }

    static splitItemLink(context) {
        const firstIndexLink = context.indexOf('http://');
        const lastIndexLink = context.indexOf('" title="');
        context = context.substring(firstIndexLink, lastIndexLink);
        return context;
    }
}

module.exports = { ThuongHieuToanCauService }