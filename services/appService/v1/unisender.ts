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
const http = getMultipartFormHttp('https://api.unisender.com/en/api/');

const api_key = process.env.UNISENDER_KEY;
const sender_email = process.env.UNISENDER_FROM_EMAIL;

const unisender = {
  getLists() {
    return http.post('getLists', formData({
      format: 'json',
      api_key
    })).then(res => res.data.result);
  },

  createList(title) {
    return http.post('createList', formData({
      format: 'json',
      api_key,
      title
    })).then(res => res.data.result);
  },

  sendEmail(emailTo, subject, htmlBody, listId = 2) {
    return http.post('sendEmail', formData({
      format: 'json',
      sender_name: 'GaltProject',
      api_key,
      sender_email,
      subject,
      list_id: listId,
      email: emailTo,
      body: htmlBody
    })).then(res => {
      console.log('unisender sendEmail', res.data.result);
      return res.data.result;
    });
  }
};

module.exports = unisender;
//
// unisender.getLists().then(res => {
//   console.log('res', res);
// });