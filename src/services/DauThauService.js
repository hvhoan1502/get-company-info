'use strict'

// Call service
const { BaseService } = require('./BaseService');
const Constants = require('../../plugins/Constants');

// Import modules
const _ = require('lodash');

class DauThauService extends BaseService {
    constructor() {

    }

    static async getAllData(city, district, startPage, endPage) {
        let results = [];
        for (let i = startPage; i < endPage; i++) {
            const uri = `${Constants.UrlSite.DauThau}province=${city}district=${district}&ward=0&businesstype=0&userid=0&page=${i}`;
            let body = await this.getAllLink(encodeURI(uri));

            body = body.trim();
            let firstIndex = body.indexOf('<div class="list-group">');
            let lastIndex = body.indexOf('<div class="pages-links">');
            // Cut body
            body = body.substring(firstIndex, lastIndex);
            body = body.split('<div class="list-group-item">');
            for (let j = 1; j < body.length; j ++) {
                let item = body[j];
                let index = item.indexOf('listing-summary');
                item = item.substring(index);
                // Get name
                let firstNameIndex = item.indexOf('/">');
                let lastNameIndex = item.indexOf('</a> </h3>');
                const name = item.substring(firstNameIndex + 3, lastNameIndex);

                // Get address
                let firstAddressIndex = item.indexOf('<b>Địa chỉ:</b>');
                item = item.substring(firstAddressIndex);
                let lastAddressIndex = item.indexOf('</div>');
                let address = item.substring(15, lastAddressIndex);

                firstAddressIndex = item.indexOf('<b>Tỉnh/tp:</b>');
                item = item.substring(firstAddressIndex);
                firstAddressIndex = item.indexOf('/">');
                lastAddressIndex = item.indexOf('</a>');
                address = address + ', ' + item.substring(firstAddressIndex + 3, lastAddressIndex);

                // Phone number
                const firstPhoneIndex = item.indexOf('ty:</b>');
                item = item.substring(firstPhoneIndex);
                const lastPhoneIndex = item.indexOf('</div>')
                const phoneNumber = item.substring(7, lastPhoneIndex);

                if (phoneNumber) {
                    results.push({
                        name,
                        address,
                        phoneNumber
                    });
                }
                
            }
        }
        return results;
    }

    static convertCityAndDistrict(dauThauInfo, options = {}) {
        const { city, district } = options;

        // City info
        const cityInfo = dauThauInfo.city.find(item => item.alias === city);
        if (!cityInfo || cityInfo === -1) {
            return null;
        }
        // District info
        const districtInfo = cityInfo.district.find(item => item.alias === district);
        if (!districtInfo || districtInfo === -1) {
            return null;
        }

        return {
            city: cityInfo.idDT,
            district: districtInfo.idDT
        }
    }
} 

module.exports = { DauThauService }