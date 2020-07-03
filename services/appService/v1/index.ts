/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGDatabase} from "../../../database/interface";
const ethereumAuthorization = require('../../authorization/ethereum');

// const utils = require('../../../utils');
const _ = require('lodash');
const pIteration = require('p-iteration');
//
// const axios = require("axios");
// const uuidv4 = require('uuid/v4');
//
// const pIteration = require('p-iteration');
// const uuidAPIKey = require('uuid-apikey');
// const crypto = require("crypto");
// const bip39 = require('bip39');

module.exports = async (database, sentry) => {
    return new IGAppService(database, sentry);
};

class IGAppService {
    database: IGDatabase;
    sentry: any;

    queueProcessing = false;

    constructor(database, sentry) {
        this.database = database;
        this.sentry = sentry;
    }

    createWallet(walletData) {
        return this.database.addWallet(walletData);
    }

    async getCryptoMetadataByEmail(email) {
        if(!email) {
            return null;
        }
        const wallet = await this.database.getWalletByEmail(email);
        if(!wallet) {
            return null;
        }
        return JSON.parse(wallet.cryptoMetadataJson);
    }

    async getCryptoMetadataByPhone(phone) {
        if(!phone) {
            return null;
        }
        const wallet = await this.database.getWalletByField('phone', phone);
        if(!wallet) {
            return null;
        }
        return JSON.parse(wallet.cryptoMetadataJson);
    }

    async getWalletByEmailAndPasswordHash(email, emailPasswordHash) {
        return this.database.getWalletByEmailAndPasswordHash(email, emailPasswordHash);
    }

    async getWalletByPhoneAndPasswordHash(phone, phonePasswordHash) {
        return this.database.getWalletByPhoneAndPasswordHash(phone, phonePasswordHash);
    }

    async getWalletByPrimaryAddress(primaryAddress) {
        return this.database.getWalletByPrimaryAddress(primaryAddress);
    }

    async updateWallet(primaryAddress, signature, walletData, expiredOn) {
        const messageParams = [
            { type: 'string', name: 'action', value: 'updateWallet'},
            { type: 'string', name: 'walletData', value: JSON.stringify(walletData)},
            { type: 'string', name: 'expiredOn', value: expiredOn.toString()}
        ];
        const expiredOnDate = new Date(parseInt(expiredOn) * 1000);
        if(new Date() > expiredOnDate) {
            throw new Error("expired");
        }
        const isValid = ethereumAuthorization.isSignatureValid(primaryAddress, signature, messageParams);
        if (!isValid) {
            throw new Error("not_valid");
        }

        const wallet = await this.getWalletByPrimaryAddress(primaryAddress);
        if(!wallet) {
            throw new Error("not_found");
        }

        console.log('wallet', wallet);
        console.log('walletData', walletData);

        await pIteration.forEach(['email', 'phone', 'primaryAddress', 'username'], async (field) => {
            if(walletData[field] && walletData[field].toLowerCase() != (wallet[field] || '').toLowerCase()) {
                if(await this.database.getWalletByField(field, walletData[field].toLowerCase())) {
                    throw new Error(field + "_busy");
                }
            }
        });

        await this.database.updateWallet({ id: wallet.id, ...walletData });

        return this.database.getWallet(walletData.id)
    }
}
