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
const uuidv4 = require('uuid/v4');

module.exports = async (database, sentry) => {
    const app = new IGAppService(database, sentry);
    if(process.env.ADMIN_ADDRESS) {
        app.setAdminsAddresses([process.env.ADMIN_ADDRESS]);
    }
    return app;
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

    async register(walletData) {
        if(walletData.email || walletData.phone) {
            const pendingWallet = await this.createPendingWallet(walletData);
            return {pendingWallet};
        } else {
            const wallet = await this.createWallet(walletData);
            return {wallet};
        }
    }

    async createPendingWallet(walletData, updateWalletId = null) {
        walletData.updateWalletId = updateWalletId;
        walletData.expiredOn = new Date(new Date().getTime() + 1000 * 60 * 60);
        if (walletData.email && !walletData.skipEmailConfirmation) {
            walletData.emailConfirmationCode = this.getRandomCode();
            walletData.emailConfirmationSentAt = new Date();
            walletData.emailConfirmationSentCount = 1;
            unisender.sendEmail(walletData.email, 'Confirmation code', walletData.emailConfirmationCode.toString());
        }
        if (walletData.phone && !walletData.skipPhoneConfirmation) {
            walletData.phoneConfirmationCode = this.getRandomCode();
            walletData.phoneConfirmationSentAt = new Date();
            walletData.phoneConfirmationSentCount = 1;
            smsc.send([walletData.phone], walletData.phoneConfirmationCode.toString());
        }
        console.log('walletData', walletData);
        const pendingWalletResult = (await this.database.addPendingWallet(walletData)).toJSON();
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

        let wallet;

        if(pendingWallet.updateWalletId) {
            await this.database.updateWallet({
                ...resultWalletData,
                id: pendingWallet.updateWalletId
            });
            wallet = await this.database.getWallet(pendingWallet.updateWalletId);
        } else {
            wallet = await this.database.addWallet(resultWalletData);
            await this.database.updatePendingWallet({
                id: pendingWalletId,
                updateWalletId: wallet.id
            });
        }
        delete pendingWallet.emailConfirmationCode;
        delete pendingWallet.phoneConfirmationCode;
        return {wallet, pendingWallet};
    }

    async confirmPendingWalletByAdmin(signature, pendingWalletId, confirmMethods = []) {
        const messageParams = [
            { type: 'string', name: 'project', value: 'GeesomeWallet'},
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

    async confirmPendingWalletByCode(pendingWalletId, confirmationMethod, value, code) {
        let pendingWallet;
        if(confirmationMethod === 'email') {
            pendingWallet = await this.database.getPendingWalletByEmailAndConfirmationCode(value, code);
        } else if(confirmationMethod === 'phone') {
            pendingWallet = await this.database.getPendingWalletByPhoneAndConfirmationCode(value, code);
        } else {
            throw new Error("unknown_method");
        }
        console.log('pendingWalletId', pendingWalletId);
        console.log('pendingWallet.id', pendingWallet.id);
        if(pendingWallet.id !== pendingWalletId) {
            throw new Error("failed");
        }
        if(!pendingWallet) {
            throw new Error("failed");
        }
        return this.createOrUpdateWalletByPendingWallet(pendingWallet.id, [confirmationMethod]);
    }

    async resendConfirmationCode(confirmationMethod, pendingWalletId) {
        if(!pendingWalletId) {
            throw new Error("incorrect_input");
        }
        let pendingWallet = (await this.database.getPendingWallet(pendingWalletId)).toJSON();
        if(!pendingWallet || !pendingWallet[confirmationMethod]) {
            throw new Error("incorrect_input");
        }
        if(new Date(pendingWallet[confirmationMethod + 'ConfirmationSentAt']) > new Date(new Date().getTime() - 1000 * 60)) {
            throw new Error("to_soon");
        }
        if(pendingWallet[confirmationMethod + 'ConfirmationSentCount'] > 3) {
            throw new Error("to_many");
        }
        let updateData: any = {};
        if(confirmationMethod === 'email') {
            updateData.emailConfirmationCode = this.getRandomCode();
            unisender.sendEmail(pendingWallet.email, 'Confirmation code', updateData.emailConfirmationCode.toString());
        } else if(confirmationMethod === 'phone') {
            updateData.phoneConfirmationCode = this.getRandomCode();
            smsc.send([pendingWallet.phone], updateData.phoneConfirmationCode.toString());
        } else {
            throw new Error("unknown_method");
        }
        updateData[confirmationMethod + 'ConfirmationSentCount'] = pendingWallet[confirmationMethod + 'ConfirmationSentCount'] + 1;
        updateData[confirmationMethod + 'ConfirmationSentAt'] = new Date();
        await this.database.updatePendingWallet({
            id: pendingWalletId,
            ...updateData
        });
        pendingWallet = (await this.database.getPendingWallet(pendingWalletId)).toJSON();
        delete pendingWallet.emailConfirmationCode;
        delete pendingWallet.phoneConfirmationCode;
        return {pendingWallet}
    }

    getRandomCode() {
        return Math.floor(Math.random() * 899999 + 100000);
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

    async getCryptoMetadataByUsername(username) {
        console.log('getCryptoMetadataByUsername', username);
        if(!username) {
            return null;
        }
        const wallet = await this.database.getWalletByField('username', username);
        console.log('wallet', wallet);
        if(!wallet) {
            return null;
        }
        console.log('wallet.cryptoMetadataJson', wallet.cryptoMetadataJson);
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

    async getAuthMessage(primaryAddress) {
        primaryAddress = primaryAddress.toLowerCase();
        const authMessage = await this.database.getLastAuthMessageByPrimaryAddress(primaryAddress);
        if(authMessage && new Date(authMessage.expiredOn) > new Date()) {
            return authMessage;
        }
        const wallet = await this.database.getWalletByPrimaryAddress(primaryAddress);
        if(!wallet) {
            throw new Error("wallet_not_found");
        }
        return this.database.addAuthMessage({
            primaryAddress,
            code: uuidv4(),
            expiredOn: new Date(new Date().getTime() + 60 * 5 * 1000)
        })
    }

    async getWalletBySignature(primaryAddress, signature) {
        const authMessage = await this.database.getLastAuthMessageByPrimaryAddress(primaryAddress);
        const messageParams = [
            { type: 'string', name: 'project', value: 'GeesomeWallet'},
            { type: 'string', name: 'action', value: 'getWallet'},
            { type: 'string', name: 'code', value: authMessage.code}
        ];
        const isValid = ethereumAuthorization.isSignatureValid(primaryAddress, signature, messageParams);
        if (!isValid) {
            throw new Error("not_valid");
        }
        if(new Date() > new Date(authMessage.expiredOn)) {
            throw new Error("expired");
        }
        return this.database.getWalletByPrimaryAddress(primaryAddress);
    }

    async updateWallet(primaryAddress, signature, walletData, expiredOn) {
        walletData = _.clone(walletData);
        const messageParams = [
            { type: 'string', name: 'project', value: 'GeesomeWallet'},
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
            wallet: await this.database.getWallet(wallet.id),
            pendingWallet
        }
    }

    async deleteWallet(walletId, signature) {
        const wallet = await this.database.getWallet(walletId);
        const messageParams = [
            { type: 'string', name: 'project', value: 'GeesomeWallet'},
            { type: 'string', name: 'action', value: 'deleteWallet'},
            { type: 'string', name: 'walletId', value: walletId.toString()}
        ];
        const isValid = ethereumAuthorization.isSignatureValid(wallet.primaryAddress, signature, messageParams);
        if (!isValid) {
            throw new Error("not_valid");
        }

        return this.database.destroyWallet(walletId);
    }
}
