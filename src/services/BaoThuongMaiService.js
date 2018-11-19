'use strict'
const { BaseService } = require('./BaseService');

const Constants = require('../../plugins/Constants');
const _ = require('lodash');

class BaoThuongMaiService extends BaseService {
    constructor() {

    }

    static async getDataDetail(city, startPage, endPage) {
        const results = [];
        city = this.formatCity(city);
        for (let i = startPage; i <= endPage; i++) {
            const uri = i > 1 ? `${Constants.UrlSite.BaoThuongMai}/${city}/page-${i}/` : `${Constants.UrlSite.BaoThuongMai}/${city}/`;
            let body = await this.getAllLink(uri);
            body = body.trim();
            const firstIndex = body.indexOf('<div class="item">');
            const lastIndex = body.indexOf('<!-- Pagination -->');
            body = body.substring(firstIndex + 18, lastIndex);
            body = body.split('<div class="item">');
            for(let i = 0; i < body.length; i++) {
                let link = this.getLinkByContext(body[i]);
                let data = await this.getDetailCompany(link);
                // Name
                const firstIndexName = data.indexOf('<strong>');
                const lastIndexName = data.indexOf('</strong>');
                const name = data.substring(firstIndexName + 8, lastIndexName);
                //Check status is active or not
                const firIndexStatus = data.indexOf('Người nộp');
                const lastIndexStatus = data.indexOf('ĐKT');
                let status;
                if (firIndexStatus !== -1 && lastIndexStatus !== -1) {
                    status = data.substring(firIndexStatus, lastIndexStatus + 4);
                }
                // dateAllow
                let index = data.indexOf('Ngày cấp');
                data = data.substring(index);
                const firstIndexDate = data.indexOf('<td>');
                const lastIndexDate = data.indexOf('</td>');
                const dateAllow = data.substring(firstIndexDate + 4, lastIndexDate);
                // address
                index = data.indexOf('Địa chỉ trụ sở');
                data = data.substring(index + 19);
                const firstIndexAddress = data.indexOf('<td>');
                const lastIndexAddress = data.indexOf('(<a');
                let address = data.substring(firstIndexAddress + 4, lastIndexAddress);
                // group by key address
                let firstKeyIndex;
                let lastKeyIndex;
                if (city === 'TP-Ho-Chi-Minh') {
                    firstKeyIndex = data.indexOf('Quận');
                    lastKeyIndex = data.indexOf(', TP Hồ Chí Minh');
                    if(firstKeyIndex === -1 || firstKeyIndex > lastKeyIndex) {
                        firstKeyIndex = data.indexOf(', Huyện');
                    }
                } else if (city == 'Ben-Tre') {
                    firstKeyIndex = data.indexOf(', Thành');
                    lastKeyIndex = data.indexOf(', Tỉnh Bến Tre');
                    if(firstKeyIndex === -1 || firstKeyIndex > lastKeyIndex) {
                        firstKeyIndex = data.indexOf(', Huyện');
                    }
                } else if (city == 'Dong-Nai') {
                    firstKeyIndex = data.indexOf(', Thành');
                    lastKeyIndex = data.indexOf(', Tỉnh Đồng Nai');
                    if(firstKeyIndex === -1 || firstKeyIndex > lastKeyIndex) {
                        firstKeyIndex = data.indexOf(', Huyện');
                    }
                    if (firstKeyIndex === -1 || firstKeyIndex > lastKeyIndex) {
                        firstKeyIndex = data.indexOf(', Thị xã');
                    }
                } else {
                    firstKeyIndex = data.indexOf(', Thành');
                    lastKeyIndex = data.indexOf(', Tỉnh Long An');
                    if(firstKeyIndex === -1 || firstKeyIndex > lastKeyIndex) {
                        firstKeyIndex = data.indexOf(', Huyện');
                    }
                }
                const groupKey = data.substring(firstKeyIndex + 2, lastKeyIndex);
                // phone number
                index = data.indexOf('Điện thoại');
                data = data.substring(index + 14);
                const firstIndexPhoneNumber = data.indexOf('<td>');
                const lastIndexPhoneNumber = data.indexOf('</td>');
                let phoneNumber;
                if(firstIndexPhoneNumber + 4 !== lastIndexPhoneNumber) {
                    phoneNumber = data.substring(firstIndexPhoneNumber + 4, lastIndexPhoneNumber);
                }
                // DD
                index = data.indexOf('Chủ sở hữu');
                data = data.substring(index);
                const firstIndexMaster = data.indexOf('<td>');
                const lastIndexMaster = data.indexOf('</td>');
                const master = data.substring(firstIndexMaster + 4, lastIndexMaster);
                // Career
                index = data.indexOf('Ngành nghề kinh doanh');
                data = data.substring(index);
                const firsrIndexCareer = data.indexOf('<td>');
                const lastIndexCareer = data.indexOf('<strong>');
                const checkCareerIndex = data.indexOf('</td>') ;
                let field;
                if (lastIndexCareer < checkCareerIndex) {
                    field = data.substring(firsrIndexCareer + 4, lastIndexCareer);
                }
                
                //result
                if (phoneNumber) {
                    results.push({name, address, phoneNumber, field, groupKey, dateAllow, master});
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
