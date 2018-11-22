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
            cookie : '__cfduid=d40d033066b55ac9c1815c7aa1c77748a1542730619; _ga=GA1.2.1661359943.1542730619; HstCfa2883594=1542730683995; HstCmu2883594=1542730683995; ASP.NET_SessionId=gcxcqxm4rz3kns3z3ogpjcv1; __RequestVerificationToken=dZjxF6PLkoZpMSRGeLDRwd3uSTDeN3Szj2_t_AKUnW0p0B4mWL0HV_XZxCIzm0_IeRefAVXTpg7yimXtXx7xAmEPsTTCWEmacINbqpUJsPg1; _gid=GA1.2.1772816263.1542896095; HstCnv2883594=2; .AspNet.ApplicationCookie=S9vX_ItPVECnGdWxUlPycnqW92fwitpTuFqVxj3tA9punHuR4ArpEApKgeQUYnpfF1yT9R0Fx0W7ZBwi7VO_Y531NmNyYKSDfsakLy-h49txIR78M6gNOtp_GNTIIkXuFC1Kh9DO5XXQyfpqkY5LLftRw-Xf9WfuM-9eYsmJhFpKMU2ngyOsIH7qlutVxdvpp7SabyokW1Hg4C3eUdleAPJanMb7of6FTj9BLmiK_tP3i3uZBODP6SbfZyIshLJMjTHWa3IwZkk0chKsYN5pd9LKuox4sB-sg_Ei-b_KCW_jtBGDp2iftognB4reU0BlMjG4ZKOrpwNH8MkAR6tRRH7vqlg_48XyCNVDXPl5TGsSK5JPsBtipKtDkBhIa_LoPqUOqZBEwFe57YH6agMqyVSLc3ZbwfnRfbAippjWdZ0Kd-kiykgSAR4dfMw4j1zz7PDnkiciTuadktbhcj9g2wRyFFnvA1n80fwiqtSZvTajn6qj1Px9wdJNPvOixlg3R3XGagGj-g5GkNcG9QYESWjCfcTaDif17lBRdf32OM0; HstCla2883594=1542903021308; HstPn2883594=37; HstPt2883594=53; HstCns2883594=6'
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