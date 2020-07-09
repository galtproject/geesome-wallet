/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */
export {};

const FormData = require('form-data');
const _ = require('lodash');
const axios = require('axios');
const http = axios.create({
  baseURL: 'https://api.unisender.com/en/api/',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

http.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    Object.assign(config.headers, config.data.getHeaders());
  }
  return config;
});

const api_key = process.env.UNISENDER_KEY;
const sender_email = process.env.UNISENDER_FROM_EMAIL;

const unisender = {
  getLists() {
    return http.post('getLists', formData({
      format: 'json',
      api_key
    })).then(res => res.data);
  },

  createList(title) {
    return http.post('createList', formData({
      format: 'json',
      api_key,
      title
    })).then(res => res.data);
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
    })).then(res => res.data);
  }
};

function formData(obj) {
  const bodyFormData = new FormData();
  _.forEach(obj, (value, name) => {
    bodyFormData.append(name, value);
  });
  return bodyFormData;
}

module.exports = unisender;