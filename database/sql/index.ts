/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */


import {IGDatabase} from "../interface";

const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const config = require('./config');

module.exports = async function(extendConfig?: any) {
    const extendedConfig = _.merge({}, config, extendConfig || {});
    
    let sequelize = new Sequelize(extendedConfig.name, extendedConfig.user, extendedConfig.password, extendedConfig.options);

    let models;
    try {
        models = await require('./models/index')(sequelize);
    } catch (e) {
        return console.error('Error', e);
    }
    
    return new SqlDatabase(sequelize, models, extendedConfig);
};

const lowerCaseFields = ['email', 'username', 'primaryAddress'];

class SqlDatabase implements IGDatabase {
    sequelize: any;
    models: any;
    config: any;
    
    constructor(_sequelize, _models, _config) {
        this.sequelize = _sequelize;
        this.models = _models;
        this.config = _config;
    }

    async flushDatabase() {
        await this.models.Wallet.destroy({ where: { } });
    }

    async addWallet(wallet) {
        lowerCaseFields.forEach(field => {
            if(wallet[field]) {
                wallet[field] = wallet[field].toLowerCase();
            }
        });
        return this.models.Wallet.create(wallet);
    }

    async addPendingWallet(wallet) {
        lowerCaseFields.forEach(field => {
            if(wallet[field]) {
                wallet[field] = wallet[field].toLowerCase();
            }
        });
        return this.models.PendingWallet.create(wallet);
    }

    async getPendingWallet(walletId) {
        return this.models.PendingWallet.findOne({ where: { id: walletId }});
    }

    async updatePendingWallet(walletData) {
        return this.models.PendingWallet.update(walletData, { where: { id: walletData.id } });
    }

    async getPendingWalletByEmailAndConfirmationCode(email, emailConfirmationCode) {
        email = email.toLowerCase();
        return this.models.PendingWallet.findOne({ where: { email, emailConfirmationCode }});
    }

    async getPendingWalletByPhoneAndConfirmationCode(phone, phoneConfirmationCode) {
        phone = phone.toLowerCase();
        return this.models.PendingWallet.findOne({ where: { phone, phoneConfirmationCode }});
    }

    async getWalletByEmail(email) {
        email = email.toLowerCase();
        return this.models.Wallet.findOne({ where: { email }});
    }

    async getWalletByField(fieldName, fieldValue) {
        fieldValue = fieldValue.toLowerCase();
        return this.models.Wallet.findOne({ where: { [fieldName]: fieldValue }});
    }

    async getWallet(id) {
        return this.models.Wallet.findOne({ where: { id }});
    }

    async getWalletCount() {
        return this.models.Wallet.count();
    }

    async getWalletList() {
        return this.models.Wallet.findAll();
    }

    async getWalletByEmailAndPasswordHash(email, emailPasswordHash) {
        email = email.toLowerCase();
        return this.models.Wallet.findOne({ where: { email, emailPasswordHash }});
    }

    async getWalletByPhoneAndPasswordHash(phone, phonePasswordHash) {
        phone = phone.toLowerCase();
        return this.models.Wallet.findOne({ where: { phone, phonePasswordHash }});
    }

    async getWalletByUsernameAndPasswordHash(username, usernamePasswordHash) {
        username = username.toLowerCase();
        return this.models.Wallet.findOne({ where: { username, usernamePasswordHash }});
    }

    async getWalletByPrimaryAddress(primaryAddress) {
        primaryAddress = primaryAddress.toLowerCase();
        return this.models.Wallet.findOne({ where: { primaryAddress }});
    }

    async updateWallet(walletData) {
        lowerCaseFields.forEach(field => {
            if(walletData[field]) {
                walletData[field] = walletData[field].toLowerCase();
            }
        });
        return this.models.Wallet.update(walletData, { where: { id: walletData.id } });
    }

    async addAuthMessage(messageData) {
        return this.models.AuthMessage.create(messageData);
    }

    async getLastAuthMessageByPrimaryAddress(primaryAddress) {
        primaryAddress = primaryAddress.toLowerCase();
        return this.models.AuthMessage.findOne({
            order: [['createdAt', 'DESC']],
            where: {primaryAddress}
        });
    }
}
