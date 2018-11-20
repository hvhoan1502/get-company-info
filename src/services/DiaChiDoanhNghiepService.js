const _ = require('lodash');

const { BaseService } = require('./BaseService');
const Constants = require('../../plugins/Constants');


class DiaChiDoanhNghiepService extends BaseService {
    constructor() {}

    static async getDataDetail(city, startPage, endPage) {
        let results = [];
        city = this.convertIDByCity(city);
        for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
            const uri = `${Constants.UrlSite.DiaChiDoanhNghiep}&id=${city}&pNum=${pageIndex}`;
            try {
                let data = await this.getAllLink(uri);
                let firstIndex = data.indexOf('<TD height="30" colspan');
                let lastIndex = data.indexOf('<p><a class=subtitle href="?menu=province');
                if (firstIndex === -1 || lastIndex === -1) {
                    continue;
                }
                data = data.substring(firstIndex, lastIndex);
                data = this.getAllLinkByHTML(data);
                data.forEach(body => {

                    firstIndex = body.indexOf('<TD height="30" colspan');
                    body = body.substring(firstIndex + 30);

                    // Name company
                    const firstIndexName = body.indexOf('">');
                    const lastIndexName = body.indexOf('</A></TD>');
                    const name = body.substring(firstIndexName + 2, lastIndexName);

                    firstIndex = body.indexOf('Địa chỉ');
                    body = body.substring(firstIndex + 30);

                    // Address
                    const firstIndexAddress = body.indexOf('g">');
                    const lastIndexAddress = body.indexOf('</td>');
                    const address = body.substring(firstIndexAddress + 3, lastIndexAddress);

                    firstIndex = body.indexOf('Điện thoại');
                    body = body.substring(firstIndex + 30);

                    // Phone Number
                    const firstIndexPhone = body.indexOf('g">');
                    const lastIndexPhone = body.indexOf('</td>');
                    const phoneNumber = body.substring(firstIndexPhone + 3, lastIndexPhone);

                    firstIndex = body.indexOf('Website');
                    body = body.substring(firstIndex + 30);

                    // WebSite
                    const firstIndexSite = body.indexOf('_blank">');
                    const lastIndexSite = body.indexOf('</a></td>');
                    const webSite = body.substring(firstIndexSite + 8, lastIndexSite);

                    firstIndex = body.indexOf('Giám đốc');
                    body = body.substring(firstIndex + 30);

                    // Master
                    const firstIndexMaster = body.indexOf('g">');
                    const lastIndexMaster = body.indexOf('</td>');
                    const master = body.substring(firstIndexMaster + 3, lastIndexMaster);

                    if (phoneNumber.length < 20) {
                        results.push({
                            name,
                            address,
                            phoneNumber,
                            webSite,
                            master
                        });
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
        return results;
    }

    static convertIDByCity(city) {
        if (city == 'thanh-pho-ho-chi-minh') {
            return 58;
        } else if (city == 'tinh-ben-tre') {
            return 8;
        } else if (city == 'tinh-dong-nai') {
            return 18;
        }
        return 37;
    }

    static getAllLinkByHTML(body) {
        let results = body.split('<div align="center" class="tinnong">');
        results.pop();
        return results;
    }
}

module.exports = { DiaChiDoanhNghiepService };