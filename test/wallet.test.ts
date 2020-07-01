/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */


import {IGAppService} from "../services/appService/interface";

const assert = require('assert');
const lib = require('geesome-wallet-client/src/lib');

describe("databaseValues", function () {
    this.timeout(10000);

    const databaseConfig = {name: 'geesome_wallet_test', options: {logging: true}};

    it("should register and login by email correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const email = 'my@email.com';
            const password = 'my-password-123';
            const phone = '+79062354313';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, email, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const emailEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const emailPasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                email,
                emailPasswordHash,
                emailEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            // Email
            const gotCryptoMetadataEmail = await appService.getCryptoMetadataByEmail(email.toUpperCase());

            const gotPasswordDerivedKey = lib.getPasswordDerivedKey(password, email.toUpperCase(), gotCryptoMetadataEmail.iterations, gotCryptoMetadataEmail.kdf);
            const gotPasswordHash = lib.getPasswordHash(gotPasswordDerivedKey, password);
            const gotWallet = await appService.getWalletByEmailAndPasswordHash(email.toUpperCase(), gotPasswordHash);

            assert.deepEqual(emailPasswordHash, gotPasswordHash);
            assert.deepEqual(gotWallet.emailEncryptedSeed, emailEncryptedSeed);

            const gotSeed = lib.decrypt(gotPasswordDerivedKey, gotWallet.emailEncryptedSeed, gotCryptoMetadataEmail.cryptoCounter);

            assert.equal(seed, gotSeed);

            const gotEthereumWallet = lib.getKeypairByMnemonic(gotSeed, 0, gotCryptoMetadataEmail.derivationPath);
            assert.equal(ethereumWallet.address, gotEthereumWallet.address);
            assert.equal(ethereumWallet.privateKey, gotEthereumWallet.privateKey);

            done();
        })()
    });

    it("should register and login by phone correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const password = 'my-password-123';
            const phone = '+79062354313';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, phone, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const phoneEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const phonePasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                phone,
                phonePasswordHash,
                phoneEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            // Phone
            const gotCryptoMetadataPhone = await appService.getCryptoMetadataByPhone(phone.toUpperCase());

            const gotPasswordDerivedKey = lib.getPasswordDerivedKey(password, phone.toUpperCase(), gotCryptoMetadataPhone.iterations, gotCryptoMetadataPhone.kdf);
            const gotPasswordHash = lib.getPasswordHash(gotPasswordDerivedKey, password);
            const gotWallet = await appService.getWalletByPhoneAndPasswordHash(phone.toUpperCase(), gotPasswordHash);

            assert.deepEqual(phonePasswordHash, gotPasswordHash);
            assert.deepEqual(gotWallet.phoneEncryptedSeed, phoneEncryptedSeed);

            const gotSeed = lib.decrypt(gotPasswordDerivedKey, gotWallet.phoneEncryptedSeed, gotCryptoMetadataPhone.cryptoCounter);

            assert.equal(seed, gotSeed);

            const gotEthereumWallet = lib.getKeypairByMnemonic(gotSeed, 0, gotCryptoMetadataPhone.derivationPath);
            assert.equal(ethereumWallet.address, gotEthereumWallet.address);
            assert.equal(ethereumWallet.privateKey, gotEthereumWallet.privateKey);

            done();
        })()
    });

    it("should updateWallet correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const email = 'my1@email.com';
            const password = 'my-password-123';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, email, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const emailEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const emailPasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                email,
                emailPasswordHash,
                emailEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            const updateData = {
                email: 'my2@email.com',
                username: 'my-username',
                phone: '+79062284122'
            };

            const expiredOn = Math.round(new Date().getTime() / 1000) + 60 * 5;
            const messageParams = [
                { type: 'string', name: 'action', value: 'updateWallet'},
                { type: 'string', name: 'walletData', value: JSON.stringify(updateData)},
                { type: 'string', name: 'expiredOn', value: expiredOn.toString()}
            ];

            console.log('ethereumWallet.address', ethereumWallet.address);
            const signature = lib.signMessage(ethereumWallet.privateKey, messageParams);

            await appService.updateWallet(ethereumWallet.address, signature, updateData, expiredOn);

            const previousEmailWallet = await appService.getWalletByEmailAndPasswordHash(email, emailPasswordHash);
            assert.equal(previousEmailWallet, null);

            const gotWallet = await appService.getWalletByEmailAndPasswordHash(updateData.email, emailPasswordHash);
            assert.equal(gotWallet.email, updateData.email);
            assert.equal(gotWallet.username, updateData.username);
            assert.equal(gotWallet.phone, updateData.phone);

            const secondaryWallet = lib.getKeypairByMnemonic(seed, 1, derivationPath);
            const incorrectSignature = lib.signMessage(secondaryWallet.privateKey, messageParams);
            try {
                await appService.updateWallet(ethereumWallet.address, incorrectSignature, updateData, expiredOn);
                assert.equal(false, true);
            } catch (e) {
                assert.equal(e.message.indexOf('not_valid') > -1, true);
            }
            done();
        })()
    });
});
