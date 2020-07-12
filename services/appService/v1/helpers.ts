export {};

const nodemailer = require('nodemailer');
const axios = require("axios");
const FormData = require('form-data');
const _ = require("lodash");

module.exports = {
  getMultipartFormHttp(baseUrl) {
    const http = axios.create({
      baseURL: baseUrl,
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
    return http;
  },

  formData(obj) {
    const bodyFormData = new FormData();
    console.log('obj', obj);
    _.forEach(obj, (value, name) => {
      bodyFormData.append(name, value);
    });
    return bodyFormData;
  },

  sendEmail(toEmail, title, htmlContent, attachments = []) {
    // const config = {
    //   mailservice: 'Gmail',
    //   mailuser: ' ',
    //   mailpass: ' ',
    // };
    //
    // const smtpConfig = {
    //   //host: config.mailhost,
    //   //port: config.mailport,
    //   service: config.mailservice,
    //   secureConnection: true,
    //   tls: {
    //     secureProtocol: "TLSv1_method"
    //   },
    //   auth : {
    //     user: config.mailuser,
    //     pass: config.mailpass
    //   }
    // };

    const gmailUser = process.env.EMAIL_USER;
    const gmailPass = process.env.EMAIL_PASS;
    console.log('gmailUser', gmailUser);
    console.log('gmailPass', gmailPass);
    if(!gmailUser || !gmailPass) {
      return console.error('EMAIL_USER or EMAIL_PASS does not set');
    }

    const transporter = nodemailer.createTransport(`smtps://${gmailUser}%40gmail.com:${gmailPass}@smtp.gmail.com`);

    var mailOptions = {
      from: `${gmailUser}@gmail.com`,
      to: toEmail,
      subject: title,
      html: htmlContent,
      attachments
      // attachments: [{
      //   filename: 'Заказ-' + order.id + '.pdf',
      //   path: file_path,
      //   contentType: 'application/pdf'
      // }]
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          reject(error);
          return console.log('Mail send error', error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
        resolve();
      });
    })
  }
};