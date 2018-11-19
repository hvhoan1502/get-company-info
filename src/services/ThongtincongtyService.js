'use strict';

const { BaseService } = require('./BaseService');
const Constants = require('../../plugins/Constants');

class ThongTinCongTyService extends BaseService {

    constructor() {
    }

    static async getDataDetail(city, district, startPage, endPage) {
        const results = [];
        for (let i = startPage; i <= endPage; i++) {
            const uri = district ? (`${Constants.UrlSite.ThongTinCongTy}${city}/${district}/?page=${i}`) : (`${Constants.UrlSite.ThongTinCongTy}${city}/?page=${i}`);
            try {
                const body = await this.getAllLink(uri);
                const st1 = body.indexOf('<div class="search-results">');
                const st2 = body.indexOf('<ul class="pagination"> <li');
                let newBody = body.substring(st1 + 28, st2 - 50);
                newBody = newBody.trim();
                const infoArray = newBody.split('<div class="search-results">')

                for (let i = 0; i < infoArray.length; i++) {
                    const item = infoArray[i];
                    const getElement = this.info(item);
                    if (getElement) {
                        const bodyDetail = await this.getDetailCompany(getElement);
                        const firstIndex = bodyDetail.indexOf('jumbotron');
                        const lastIndex = bodyDetail.indexOf('div align="center"><script async src');
                        let data = bodyDetail.substring(firstIndex + 11, lastIndex);
                        // name
                        let firstIndexName = data.indexOf('>CÔNG');
                        let lastIndexName = data.indexOf('</span>');
                        let name = data.substring(firstIndexName + 1, lastIndexName);
                        if (name.includes('<h4>')) {
                            firstIndexName = name.indexOf('<span title="');
                            name = name.substring(firstIndexName + 13);
                            lastIndexName = name.indexOf('">');
                            name = name.substring(0, lastIndexName);
                        }
                        //address
                        let address;
                        const firstIndexAddress = data.indexOf('Địa chỉ');
                        const lastIndexAddress = data.indexOf('Minh<br/>');
                        address = data.substring(firstIndexAddress, lastIndexAddress + 4);

                        if (city == 'thanh-pho-ho-chi-minh') {
                            const firstIndexAddress = data.indexOf('Địa chỉ');
                            const lastIndexAddress = data.indexOf('Minh<br/>');
                            address = data.substring(firstIndexAddress, lastIndexAddress + 4);
                        } else if (city === 'tinh-ben-tre') {
                            const firstIndexAddress = data.indexOf('Địa chỉ');
                            const lastIndexAddress = data.indexOf('Tre<br/>');
                            address = data.substring(firstIndexAddress, lastIndexAddress + 3);
                        } else if (city === 'tinh-dong-nai') {
                            const firstIndexAddress = data.indexOf('Địa chỉ');
                            const lastIndexAddress = data.indexOf('Nai<br/>');
                            address = data.substring(firstIndexAddress, lastIndexAddress + 3);
                        } else {
                            const firstIndexAddress = data.indexOf('Địa chỉ');
                            const lastIndexAddress = data.indexOf('An<br/>');
                            address = data.substring(firstIndexAddress, lastIndexAddress + 2);
                        }
                        // ndd
                        data = data.substring(lastIndexAddress + 5);
                        const firstIndexMaster = data.indexOf('Đại diện pháp luật');
                        const lastIndexMaster = data.indexOf('<br/> ');
                        let master;
                        if (firstIndexMaster > 0 && lastIndexMaster > 0) {
                            master = data.substring(firstIndexMaster, lastIndexMaster);
                            if (master.includes('/')) {
                                master = null;
                            }
                        }
                        //sdt link
                        const firstIndexPhone = data.indexOf('Điện thoại: <img src=');
                        const lastIndexPhone = data.indexOf('"><br/>');
                        let phoneNumber;
                        if (firstIndexPhone !== -1 && lastIndexPhone !== -1) {
                            phoneNumber = data.substring(firstIndexPhone + 22, lastIndexPhone);
                        }
                        //Date allow
                        const firstIndexDate = data.indexOf('phép:');
                        data = data.substring(firstIndexDate +5);
                        const lastIndexDate = data.indexOf('<br/>');
                        const dateAllow = data.substring(1, lastIndexDate);
                        // console.log({name, address, phoneNumber});
                        if (name && address && phoneNumber) {
                            results.push({
                                name,
                                address,
                                phoneNumber,
                                master,
                                dateAllow
                            });
                        };

                    }
                }
            } catch (err) {
                throw new Error('Bị lỗi');
            }
        }
        return results;
    }

    static info(data) {
        //name
        const firstIndexName = data.indexOf('"');
        const lastIndexName = data.indexOf('">');
        const link = data.substring(firstIndexName + 1, lastIndexName);

        return link;
    };
}

module.exports = {
    ThongTinCongTyService
}