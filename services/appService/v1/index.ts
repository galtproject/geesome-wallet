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

const _ = require('lodash');
const pIteration = require('p-iteration');
const unisender = require('./unisender');
const smsc = require('./smsc');

module.exports = async (database, sentry) => {
    return new IGAppService(database, sentry);
};

class IGAppService {
    database: IGDatabase;
    sentry: any;
    adminsAddresses: string[] = [];

    queueProcessing = false;

    constructor(database, sentry) {
        this.database = database;
        this.sentry = sentry;
    }

    setAdminsAddresses(adminsAddresses) {
        console.log('setAdminsAddresses', adminsAddresses);
        this.adminsAddresses = adminsAddresses;
    }

    async createPendingWallet(walletData, updateWalletId = null) {
        walletData.updateWalletId = updateWalletId;
        walletData.expiredOn = new Date(new Date().getTime() + 1000 * 60 * 60);
        if (walletData.email) {
            walletData.emailConfirmationCode = Math.round(Math.random() * 10 ** 6);
            unisender.sendEmail(walletData.email, 'Confirmation code', walletData.emailConfirmationCode.toString());
        }
        if (walletData.phone) {
            walletData.phoneConfirmationCode = Math.round(Math.random() * 10 ** 6);
            smsc.send(walletData.phone, walletData.phoneConfirmationCode.toString());
        }
        console.log('walletData', walletData);
        const pendingWalletResult = await this.database.addPendingWallet(walletData);
        delete pendingWalletResult.emailConfirmationCode;
        delete pendingWalletResult.phoneConfirmationCode;
        return pendingWalletResult;
    }

    async createOrUpdateWalletByPendingWallet(pendingWalletId, confirmMethods = []) {
        const pendingWallet = (await this.database.getPendingWallet(pendingWalletId)).toJSON();
        const expiredOnDate = new Date(pendingWallet.expiredOn);
        if(new Date() > expiredOnDate) {
            throw new Error("expired");
        }
        const resultWalletData = {};

        ['username', 'usernamePasswordHash', 'primaryAddress', 'usernameEncryptedSeed', 'cryptoMetadataJson'].forEach(field => {
            if(pendingWallet[field]) {
                resultWalletData[field] = pendingWallet[field];
            }
        });

        if(confirmMethods.includes('phone')) {
            ['phone', 'phonePasswordHash', 'phoneEncryptedSeed'].forEach(field => {
                if(pendingWallet[field]) {
                    resultWalletData[field] = pendingWallet[field];
                }
            });
        }

        if(confirmMethods.includes('email')) {
            ['email', 'emailPasswordHash', 'emailEncryptedSeed'].forEach(field => {
                if(pendingWallet[field]) {
                    resultWalletData[field] = pendingWallet[field];
                }
            });
        }

        if(pendingWallet.updateWalletId) {
            await this.database.updateWallet({
                id: pendingWallet.updateWalletId,
                ...resultWalletData
            });
            return this.database.getWallet(pendingWallet.updateWalletId);
        } else {
            const wallet = await this.database.addWallet(resultWalletData);
            await this.database.updatePendingWallet({
                id: pendingWallet.updateWalletId,
                updateWalletId: wallet.id
            });
            return wallet;
        }
    }

    async confirmPendingWalletByAdmin(signature, pendingWalletId, confirmMethods = []) {
        const messageParams = [
            { type: 'string', name: 'action', value: 'confirmPendingWallet'},
            { type: 'string', name: 'pendingWalletId', value: pendingWalletId.toString(10)},
            { type: 'string', name: 'confirmMethods', value: confirmMethods}
        ];
        console.log('messageParams', messageParams);
        const isValid = ethereumAuthorization.isSignatureValidByAddressesList(this.adminsAddresses, signature, messageParams);
        if (!isValid) {
            throw new Error("not_valid");
        }

        return this.createOrUpdateWalletByPendingWallet(pendingWalletId, confirmMethods);
    }

    async confirmPendingWalletByCode(confirmationMethod, value, code) {
        let pendingWallet;
        if(confirmationMethod === 'email') {
            pendingWallet = await this.database.getPendingWalletByEmailAndConfirmationCode(value, code);
        } else if(confirmationMethod === 'phone') {
            pendingWallet = await this.database.getPendingWalletByPhoneAndConfirmationCode(value, code);
        } else {
            throw new Error("failed");
        }
        if(!pendingWallet) {
            throw new Error("failed");
        }
        return this.createOrUpdateWalletByPendingWallet(pendingWallet.id, [confirmationMethod]);
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

    async getCryptoMetadataByUsername(phone) {
        if(!phone) {
            return null;
        }
        const wallet = await this.database.getWalletByField('username', phone);
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

    async getWalletByUsernameAndPasswordHash(username, usernamePasswordHash) {
        return this.database.getWalletByUsernameAndPasswordHash(username, usernamePasswordHash);
    }

    async getWalletByPrimaryAddress(primaryAddress) {
        return this.database.getWalletByPrimaryAddress(primaryAddress);
    }

    async updateWallet(primaryAddress, signature, walletData, expiredOn) {
        walletData = _.clone(walletData);
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

        let pendingWalletData = {};
        if(walletData['email'] && walletData['email'].toLowerCase() != (wallet['email'] || '').toLowerCase()) {
            ['email', 'emailPasswordHash', 'emailEncryptedSeed'].forEach(field => {
                pendingWalletData[field] = walletData[field];
                delete walletData[field];
            });
        }
        if(walletData['phone'] && walletData['phone'].toLowerCase() != (wallet['phone'] || '').toLowerCase()) {
            ['phone', 'phonePasswordHash', 'phoneEncryptedSeed'].forEach(field => {
                pendingWalletData[field] = walletData[field];
                delete walletData[field];
            });
        }

        await this.database.updateWallet({ id: wallet.id, ...walletData });

        let pendingWallet;
        if(!_.isEmpty(pendingWalletData)) {
            pendingWallet = await this.createPendingWallet(pendingWalletData, wallet.id);
        }

        return {
            wallet: await this.database.getWallet(walletData.id),
            pendingWallet
        }
    }
}
