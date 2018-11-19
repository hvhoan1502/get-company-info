'use strict'
const { BaseService } = require('./BaseService');

const Constants = require('../../plugins/Constants');

class BaoThuongMaiService extends BaseService {
    constructor() {

    }

    static async getDataDetail(city, startPage, endPage) {
        const results = [];
        city = this.formatCity(city);
        for (let i = startPage; i <= endPage; i++) {
            const uri = `${Constants.UrlSite.Constants}/${city}/page-${i}`;
            let body = await this.getAllLink(uri);
            body = body.trim();
            const firstIndex = body.indexOf('<div class="item">');
            const lastIndex = body.indexOf('<!-- Pagination -->');
            body = body.substring(firstIndex + 18, lastIndex);
            body =body.split('<div class="item">');
            for(let i = 0; i < body.length; i++) {
                let link = this.getLinkByContext(body[i]);
                let data = await this.getDetailCompany(link);
                const firstIndexName = data.indexOf('<strong>');
                const lastIndexName = data.indexOf('</strong>');
                const name = data.substring(firstIndexName + 8, lastIndexName);
                //Check status is active or not
                const firIndexStatus = data.indexOf('Người nộp');
                const lastIndexStatus = data.indexOf('ĐKT');
                if (firIndexStatus === -1 || lastIndexStatus === -1) {
                    return resolve(null);
                }
                // address
                let index = data.indexOf('Địa chỉ trụ sở');
                data = data.substring(index + 19);
                const firstIndexAddress = data.indexOf('<td>');
                const lastIndexAddress = data.indexOf('(<a');
                let address = data.substring(firstIndexAddress + 4, lastIndexAddress);
                // group by key address
                let firstKeyIndex = data.indexOf('Quận');;
                const lastKeyIndex = data.indexOf(', TP Hồ Chí Minh');
                if(firstKeyIndex > lastKeyIndex) {
                    firstKeyIndex = data.indexOf('Huyện');
                }
                const groupKey = data.substring(firstKeyIndex, lastKeyIndex);
                // phone number
                index = data.indexOf('Điện thoại');
                data = data.substring(index + 14);
                const firstIndexPhoneNumber = data.indexOf('<td>');
                const lastIndexPhoneNumber = data.indexOf('</td>');
                if(firstIndexPhoneNumber + 4 === lastIndexPhoneNumber) {
                    return resolve(null);
                }
                const phoneNumber = data.substring(firstIndexPhoneNumber + 4, lastIndexPhoneNumber)
                // Career
                index = data.indexOf('Ngành nghề kinh doanh');
                data = data.substring(index);
                const firsrIndexCareer = data.indexOf('<td>');
                const lastIndexCareer = data.indexOf('<strong>');
                const field = data.substring(firsrIndexCareer + 4, lastIndexCareer);
                //result
                if (phoneNumber) {
                    results.push({name, address, phoneNumber, field, groupKey});
                }
            }

        }
        return _.groupBy(results, item => item.groupKey);
    }

    static formatCity(city) {
        if (city == 'thanh-pho-ho-chi-minh') {
            return 'TP-Ho-Chi-Minh';
        } else if (city == 'tinh-ben-tre') {
            return 'Ben-Tre';
        } else if (city == 'tinh-dong-nai') {
            return 'Dong-Nai';
        } else {
            return 'Long-An';
        }
    }

    static getLinkByContext(context) {
        const firstIndexLink = context.indexOf('<a href=');
        const lastIndexLink = context.indexOf('.html">');
        return context.substring(firstIndexLink + 9, lastIndexLink + 5);
    }
}

module.exports = { BaoThuongMaiService };
