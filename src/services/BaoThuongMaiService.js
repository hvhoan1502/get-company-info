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
            const uri = i > 1 ? `${Constants.UrlSite.BaoThuongMai}/${city}/trang-${i}/` : `${Constants.UrlSite.BaoThuongMai}/${city}/`;
            let body = await this.getAllLink(uri);
            body = body.trim();
            const firstIndex = body.indexOf('<div class="company-item">');
            const lastIndex = body.indexOf('pagination-container');
            body = body.substring(firstIndex + 25, lastIndex);
            body = body.split('<div class="company-item">');
            for(let i = 0; i < body.length; i++) {
                let link = this.getLinkByContext(body[i]);
                let data = await this.getDetailCompany('https:' + link);
                // Name
                const firstIndexName = data.indexOf('<h1>');
                const lastIndexName = data.indexOf('</h1>');
                const name = data.substring(firstIndexName + 4, lastIndexName);
                //Check status is active or not
                const firIndexStatus = data.indexOf('Đang hoạt');
                const lastIndexStatus = data.indexOf('ĐKT');
                let status;
                if (firIndexStatus !== -1 && lastIndexStatus !== -1) {
                    status = data.substring(firIndexStatus, lastIndexStatus + 4);
                }
                // address
                let index = data.indexOf('Địa chỉ:');
                data = data.substring(index + 20);
                const firstIndexAddress = data.indexOf('cell">')
                const lastIndexAddress = data.indexOf('</div>');
                let address = data.substring(firstIndexAddress + 6, lastIndexAddress);
                // group by key address
                let firstKeyIndex;
                let lastKeyIndex;
                if (city === 'TP-Ho-Chi-Minh') {
                    firstKeyIndex = data.indexOf(', Quận');
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
                index = data.indexOf('Điện thoại:');
                let phoneNumber;
                if (index !== -1) {
                    data = data.substring(index + 20);
                    const firstIndexPhoneNumber = data.indexOf('-cell">');
                    const lastIndexPhoneNumber = data.indexOf('</div>');
                    if(firstIndexPhoneNumber + 7 !== lastIndexPhoneNumber) {
                        phoneNumber = data.substring(firstIndexPhoneNumber + 7, lastIndexPhoneNumber);
                    }
                }
                // DD
                index = data.indexOf('Đại diện pháp luật:');
                data = data.substring(index + 20);
                const firstIndexMaster = data.indexOf('cell">');
                const lastIndexMaster = data.indexOf('</div>');
                const master = data.substring(firstIndexMaster + 6, lastIndexMaster);
                // dateAllow
                index = data.indexOf('Ngày cấp giấy phép:');
                data = data.substring(index + 20);
                const firstIndexDate = data.indexOf('cell">');
                const lastIndexDate = data.indexOf('</div>');
                const dateAllow = data.substring(firstIndexDate + 6, lastIndexDate);
                // Career
                index = data.indexOf('Ngành nghề kinh doanh:');
                data = data.substring(index + 20);
                const firsrIndexCareer = data.indexOf('<strong>');
                const lastIndexCareer = data.indexOf('</strong>');
                let field;
                if (firsrIndexCareer !== -1 && lastIndexCareer !== -1) {
                    field = data.substring(firsrIndexCareer + 8, lastIndexCareer);
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
        const lastIndexLink = context.indexOf('.html"');
        return context.substring(firstIndexLink + 9, lastIndexLink + 5);
    }
}

module.exports = { BaoThuongMaiService };
