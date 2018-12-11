const Constants = require('../../plugins/Constants');
const dataList = require('../../plugins/Info.json');
const _ = require('lodash');
const request = require('request');

const { BaseService } = require('./BaseService');


class VinabizService extends BaseService {
    constructor() {
        
    }

    static async getDataDetail(city, district, startPage, endPage) {
        let results = [];
        // headers request
        const headers = {
            accept: 'text/css,*/*;q=0.1',
            cookie : '__cfduid=d40d033066b55ac9c1815c7aa1c77748a1542730619; _ga=GA1.2.1661359943.1542730619; HstCfa2883594=1542730683995; HstCmu2883594=1542730683995; ASP.NET_SessionId=ksz5zui1kr15lz1mwqowe0js; __RequestVerificationToken=Qf9gHkAwTyDwZ0SdJoybDSXJveCzdFpnbF2QaFNszHH4FwJc6YPmFM4oJ6uIMXWvLnCRp8JF-Zd4WCymlAQ6AgTwQOwcGISRllgWKyoVBhc1; _gid=GA1.2.2061546137.1544542601; HstCnv2883594=3; HstCns2883594=8; .AspNet.ApplicationCookie=BqQG2TqYDDqAYwyG8eu5wM2gjP2ZepwJ_FVzytVELUjShbYbvqR1jUEzDkH2uv_zz0qUEFUSw7ojjT3kZXf5_Wr-NgVg0cLmZ626Ix9DNh0Oc-FzZGDnL9vjNiIwCaen9Af4y79khPXcjrKw8FjOPDzxlM7A4DyZyHzIMRlTi6rAykW18ROR4REMvODfdHj9jHcXl7r1C4cbhMPAAh-tSaUkJYl4PbVMHTMQT5xjzjYiPaSK37MjhPCxtPCdFlkY307pAoTs8aHY5U0D181XpPz4MCYqeQMClLrKKTjdduxr54ThmSz8So0PVugQ9_Xt5gntGVIT7--hZ7lfK02fqVpkBovt7Hw6-ZIk0iy6tOyCQeUiSmctEu2Xy_BLeDXvuS9DrtI5UuNwZXLDN-C9U5zqZX_SBOK_s_NuB6hp6hVGduoy_7xNwAOfdg5ro0MJVbKumQWW07s8q4c1d2j8zhm4TbV5LlKHUtA2J0Q6iFiZuNk1AcJRRMrKMl88MaX93imyc8clnwsYXivlwZRhd7B2Fw2ii1FF6CSzouSUh4U; HstCla2883594=1544542609671; HstPn2883594=2; HstPt2883594=81'
        };

        const idLocation = this.getIdByName(city, district);
        city = this.formatCityName(city);
        let uri = district ? `${Constants.UrlSite.VinaBizDistrict}/${district}/${idLocation}` : `${Constants.UrlSite.VinaBizCity}/${city}/${idLocation}`;

        for (let i = startPage; i <=endPage; i++) {
            const url = uri + '/' + i;
            let body = await this.getAllLink(url, headers);
            let firstIndex = body.indexOf('<h4 style="font-size: 15px; font-weight: 700;">');
            body = body.substring(firstIndex  + 10);
            body = body.split('<h4 style="font-size: 15px; font-weight: 700;">');
            for (let item = 0; item < body.length; item ++) {
                firstIndex = body[item].indexOf('f="/');
                let lastIndex = body[item].indexOf('" rel="tooltip"');
                const link = 'https://vinabiz.org' + body[item].substring(firstIndex + 3, lastIndex);
                let data = await this.getDetailCompany(link, headers);
                // Check status
                if (data.includes('đã chuyển sang') || data.includes('ngừng hoạt động')) {
                    continue;
                }

                // Name
                let firstNameIndex = data.indexOf('<title>');
                let lastNameIndex = data.indexOf('</title>');
                const name = data.substring(firstNameIndex + 7, lastNameIndex);

                data = data.substring(lastNameIndex + 10);

                // Address
                let firstAddressIndex = data.indexOf('Địa chỉ:');
                let lastAddressIndex = data.indexOf('">');
                const address = data.substring(firstAddressIndex + 9, lastAddressIndex);

                firstIndex = data.indexOf('Ngày bắt đầu hoạt động');
                data = data.substring(firstIndex + 26);

                // Date allow active
                const firstIndexDate = data.indexOf('<td>');
                const lastIndexDate = data.indexOf('</td>');
                const dateAllow = data.substring(firstIndexDate + 4, lastIndexDate);

                // Phone Number
                const firstIndexPhone = data.indexOf('<b>');
                const lastIndexPhone = data.indexOf('</b>');
                const phoneNumber = data.substring(firstIndexPhone + 3, lastIndexPhone);

                firstIndex = data.indexOf('Người đại diện');
                data = data.substring(firstIndex + 19);

                // Master
                const firstIndexMaster = data.indexOf('<td>');
                const lastIndexMaster = data.indexOf('</td>');
                const master = data.substring(firstIndexMaster + 4, lastIndexMaster);
                

                firstIndex = data.indexOf('Giám đốc');
                data = data.substring(firstIndex + 14);

                // Manager
                const firstManagerIndex = data.indexOf('<td>');
                const lastManagerIndex = data.indexOf('</td>');
                const manager = data.substring(firstManagerIndex + 4, lastManagerIndex);

                // phone Master
                const firstMasterPhone = data.indexOf('<b>');
                const lastMasterPhone = data.indexOf('</b>');
                const masterPhone = data.substring(firstMasterPhone + 3, lastMasterPhone);

                firstIndex = data.indexOf('Kế toán');
                data = data.substring(firstIndex + 12);
                
                // Accountant
                firstIndex = data.indexOf('<td>');
                lastIndex = data.indexOf('</td>');
                const accountant = data.substring(firstIndex + 4, lastIndex);

                firstIndex = data.indexOf('Điện thoại kế toán');
                data = data.substring(firstIndex + 22);

                // Accountant phone number
                firstIndex = data.indexOf('<b>');
                lastIndex = data.indexOf('</b>');
                const accountantPhone = data.substring(firstIndex + 3, lastIndex);

                if (phoneNumber || masterPhone || accountantPhone) {
                    results.push({
                        name,
                        address,
                        dateAllow,
                        phoneNumber,
                        manager,
                        master,
                        masterPhone,
                        accountant,
                        accountantPhone
                    });
                }

            }
        }

        return results;
        
    }

    static getIdByName(city, district) {
        let districtObj = {};
        const cityObject = dataList.city.find(item => item.alias === city);
        if (district) {
            districtObj = cityObject.district.find(item => item.alias === district);
        }

        const id = districtObj.idvina || cityObject.idvina;
        return id;
    }

    static formatCityName(city) {
        switch(city) {
            case 'thanh-pho-ho-chi-minh': 
                city = 'tp-ho-chi-minh';
                break;
            case 'tinh-dong-nai':
                city = 'dong-nai';
                break;
            case 'tinh-ben-tre':
                city = 'ben-tre';
                break;
            case 'tinh-long-an':
                city = 'long-an';
                break;
        }

        return city;
    }
} 

module.exports = { VinabizService };