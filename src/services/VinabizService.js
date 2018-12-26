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
            cookie : '__cfduid=d40d033066b55ac9c1815c7aa1c77748a1542730619; _ga=GA1.2.1661359943.1542730619; HstCfa2883594=1542730683995; ASP.NET_SessionId=tcaocfhxvluch3uovlnpcxpi; __RequestVerificationToken=UeVx4cIsasf_TKNmXP6srdh9YItSyQhR6an79I0ziu1sYTlhQHHtMzXafvJUtsWiN2jCmJ5Et_3BfvSeMlVDG2jcJNpRoIjTxEIwYms1ZIc1; _gid=GA1.2.2071647698.1545785567; _gat=1; HstCmu2883594=1545785566758; HstCnv2883594=4; HstCns2883594=9; .AspNet.ApplicationCookie=peQjSrOT3dqu9QQPk4JLSnAoPzwg0UDYnUpwZFM2FXOZ8H3fEK7Pn13ZymrojEH2QdekNsWvNEUH-cfn-2MpbhfWOe1I_52n17pRPorTIAErUD_iqJpyAaHTo-f9bOAEYdf_pXRVm88traadWJOHU6qFNMPw1XIRddmeKE78QGi61kHGFdWycZzcy1b6pvJfhSEkVmIg30Ewt3QQ48voL9bHPRIRMJYrguGWqJIGTHSMXqPNSSzdRGDInKil_ivZd2TiqkBIS-Gb6sEQC7xyUuETsnSC3c5NyG1SzgY5rAzFLzRE6oIwsSp4Gh0_QK3Rd37e5Lc0ZV8KAFwgpOqoKGyQZrw-g5PnjzAmTDKD3KS1Nn_ym8ybY55JanEBs604uXAyH27j0nH-n_nKqXvRDbZAr5Gbh0HaDEwhL0ubvsBrHjTiDAc-BRHtS0s61a_Bl3oEoHw07W3T93ZkL47eUDCp8J8ywXm8zgjCioVOmkA6Af0UE-f3a_N5EzMinkCDHuwCQpBLgwvd4ZRsUXfwPsQPDjAOijTfhQzj7pcxdEqU4y4uKyTPlPClE7V1z_mv; HstCla2883594=1545785572429; HstPn2883594=2; HstPt2883594=84'
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