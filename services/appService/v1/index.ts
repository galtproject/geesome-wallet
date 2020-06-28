/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGDatabase} from "../../../database/interface";

// const utils = require('../../../utils');
const _ = require('lodash');
//
// const axios = require("axios");
// const uuidv4 = require('uuid/v4');
//
// const pIteration = require('p-iteration');
// const uuidAPIKey = require('uuid-apikey');
// const crypto = require("crypto");
// const bip39 = require('bip39');

module.exports = async (database, sentry) => {
    return new DCityAppService(database, sentry);
};

class DCityAppService {
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
        const wallet = await this.database.getWalletByEmail(email);
        if(!wallet) {
            return null;
        }
        return JSON.parse(wallet.cryptoMetadataJson);
    }

    async getWalletByEmailAndPasswordHash(email, passwordHash) {
        return this.database.getWalletByEmailAndPasswordHash(email, passwordHash);
    }

    async updateWallet(email, passwordHash, walletData) {
        const wallet = await this.getWalletByEmailAndPasswordHash(email, passwordHash);
        if(!wallet) {
            throw new Error("not_found");
        }
        if(walletData.email && walletData.email != wallet.email) {
            const walletByNewEmail = await this.database.getWalletByEmail(walletData.email);
            if(!walletByNewEmail) {
                throw new Error("email_busy");
            }
        }
        await this.database.updateWallet({
            id: walletData.id,
            ..._.pick(walletData, ['cryptoMetadataJson', 'settingsJson', 'email', 'passwordHash', 'encryptedSeed'])
        });

        return this.database.getWallet(walletData.id)
    }
}
