/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */
export {};

const {getMultipartFormHttp, formData} = require('./helpers');
const http = getMultipartFormHttp('https://smsc.ru/sys/');

const login = process.env.SMSC_LOGIN;
const psw = process.env.SMSC_PASSWORD;

const smsc = {
  send(phones, mes) {
    return http.post('send.php', formData({
      login,
      psw,
      mes,
      phones: phones.join(',')
    })).then(res => {
      console.log('smsc send', res.data);
      return res.data;
    });
  }
};

module.exports = smsc;