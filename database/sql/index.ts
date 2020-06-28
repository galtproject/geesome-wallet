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
    
    return new MysqlDCityDatabase(sequelize, models, extendedConfig);
};

class MysqlDCityDatabase implements IGDatabase {
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
        return this.models.Wallet.create(wallet);
    }

    async getWalletByEmail(email) {
        return this.models.Wallet.findOne({ where: { email }});
    }

    async getWallet(id) {
        return this.models.Wallet.findOne({ where: { id }});
    }

    async getWalletByEmailAndPasswordHash(email, passwordHash) {
        return this.models.Wallet.findOne({ where: { email, passwordHash }});
    }

    async updateWallet(walletData) {
        return this.models.Wallet.update({ where: { id: walletData.id } }, walletData);
    }
}
