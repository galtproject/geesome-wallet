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

    async getWalletByEmail(email) {
        email = email.toLowerCase();
        return this.models.Wallet.findOne({ where: { email }});
    }

    async getWalletByField(fieldName, fieldValue) {
        return this.models.Wallet.findOne({ where: { [fieldName]: fieldValue }});
    }

    async getWallet(id) {
        return this.models.Wallet.findOne({ where: { id }});
    }

    async getWalletByEmailAndPasswordHash(email, emailPasswordHash) {
        email = email.toLowerCase();
        return this.models.Wallet.findOne({ where: { email, emailPasswordHash }});
    }

    async getWalletByPhoneAndPasswordHash(phone, phonePasswordHash) {
        phone = phone.toLowerCase();
        return this.models.Wallet.findOne({ where: { phone, phonePasswordHash }});
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
}
