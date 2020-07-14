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

    const databaseConfig = {name: 'geesome_wallet_test', options: {logging: false}};

    const adminWallet = lib.getKeypairByMnemonic(lib.generateMnemonic(), 0, `m/44'/60'/0'/0/`);

    it("should register and login by email correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);
            appService.setAdminsAddresses([adminWallet.address]);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const email = 'my@email.com';
            const password = 'my-password-123';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, email, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const emailEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const emailPasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            const pendingWallet = await appService.createPendingWallet({
                email,
                emailPasswordHash,
                emailEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            const confirmPendingWalletMessage = [
                { type: 'string', name: 'project', value: 'GeesomeWallet'},
                { type: 'string', name: 'action', value: 'confirmPendingWallet'},
                { type: 'string', name: 'pendingWalletId', value: pendingWallet.id.toString()},
                { type: 'string', name: 'confirmMethods', value: ['email']}
            ];
            console.log('confirmPendingWalletMessage', confirmPendingWalletMessage);

            const incorrectSignature = lib.signMessage(ethereumWallet.privateKey, confirmPendingWalletMessage);
            try {
                await appService.confirmPendingWalletByAdmin(incorrectSignature, pendingWallet.id, ['email']);
                assert.equal(false, true);
            } catch (e) {
                assert.equal(e.message.indexOf('not_valid') > -1, true);
            }

            let gotCryptoMetadataEmail = await appService.getCryptoMetadataByEmail(email.toUpperCase());
            assert.equal(gotCryptoMetadataEmail, null);

            const correctSignature = lib.signMessage(adminWallet.privateKey, confirmPendingWalletMessage);
            await appService.confirmPendingWalletByAdmin(correctSignature, pendingWallet.id, ['email']);

            // Email
            gotCryptoMetadataEmail = await appService.getCryptoMetadataByEmail(email.toUpperCase());

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

    it("should register and login by username correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const password = 'my-password-123';
            const username = 'my-username';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, username, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const usernameEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const usernamePasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                username,
                usernamePasswordHash,
                usernameEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            // Username
            const gotCryptoMetadataUsername = await appService.getCryptoMetadataByUsername(username.toUpperCase());

            const gotPasswordDerivedKey = lib.getPasswordDerivedKey(password, username.toUpperCase(), gotCryptoMetadataUsername.iterations, gotCryptoMetadataUsername.kdf);
            const gotPasswordHash = lib.getPasswordHash(gotPasswordDerivedKey, password);
            const gotWallet = await appService.getWalletByUsernameAndPasswordHash(username.toUpperCase(), gotPasswordHash);

            assert.deepEqual(usernamePasswordHash, gotPasswordHash);
            assert.deepEqual(gotWallet.usernameEncryptedSeed, usernameEncryptedSeed);

            const gotSeed = lib.decrypt(gotPasswordDerivedKey, gotWallet.usernameEncryptedSeed, gotCryptoMetadataUsername.cryptoCounter);

            assert.equal(seed, gotSeed);

            const gotEthereumWallet = lib.getKeypairByMnemonic(gotSeed, 0, gotCryptoMetadataUsername.derivationPath);
            assert.equal(ethereumWallet.address, gotEthereumWallet.address);
            assert.equal(ethereumWallet.privateKey, gotEthereumWallet.privateKey);

            done();
        })()
    });

    it("should login by signature correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const password = 'my-password-123';
            const username = 'my-username-3';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, username, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const usernameEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const usernamePasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                username,
                usernamePasswordHash,
                usernameEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            try {
                await appService.getAuthMessage(adminWallet.address);
                assert.equal(true, false);
            } catch (e) {
                assert.equal(e.message, "wallet_not_found");
            }

            const authMessage = await appService.getAuthMessage(ethereumWallet.address);

            const incorrectSignature = lib.signMessage(adminWallet.privateKey, [
                { type: 'string', name: 'code', value: authMessage.code}
            ]);
            try {
                await appService.getWalletBySignature(ethereumWallet.address, incorrectSignature);
                assert.equal(true, false);
            } catch (e) {
                assert.equal(e.message, "not_valid");
            }

            const signature = lib.signMessage(ethereumWallet.privateKey, [
                { type: 'string', name: 'project', value: 'GeesomeWallet'},
                { type: 'string', name: 'action', value: 'getWallet'},
                { type: 'string', name: 'code', value: authMessage.code}
            ]);

            const gotWallet = await appService.getWalletBySignature(ethereumWallet.address, signature);

            assert.equal(gotWallet.username, username);

            done();
        })()
    });

    it("should updateWallet correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);
            appService.setAdminsAddresses([adminWallet.address]);

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
                username: 'my-username-2',
                phone: '+79062284122'
            };

            const expiredOn = Math.round(new Date().getTime() / 1000) + 60 * 5;
            const messageParams = [
                { type: 'string', name: 'project', value: 'GeesomeWallet'},
                { type: 'string', name: 'action', value: 'updateWallet'},
                { type: 'string', name: 'walletData', value: JSON.stringify(updateData)},
                { type: 'string', name: 'expiredOn', value: expiredOn.toString()}
            ];

            console.log('ethereumWallet.address', ethereumWallet.address);
            const signature = lib.signMessage(ethereumWallet.privateKey, messageParams);

            const {pendingWallet} = await appService.updateWallet(ethereumWallet.address, signature, updateData, expiredOn);
            const confirmPendingWalletMessage = [
                { type: 'string', name: 'project', value: 'GeesomeWallet'},
                { type: 'string', name: 'action', value: 'confirmPendingWallet'},
                { type: 'string', name: 'pendingWalletId', value: pendingWallet.id.toString()},
                { type: 'string', name: 'confirmMethods', value: ['email', 'phone']}
            ];
            const correctSignature = lib.signMessage(adminWallet.privateKey, confirmPendingWalletMessage);
            await appService.confirmPendingWalletByAdmin(correctSignature, pendingWallet.id, ['email', 'phone']);

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

    it("should updateWallet correctly with username only", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);
            appService.setAdminsAddresses([adminWallet.address]);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const password = 'my-password-123';
            const username = 'test-username-40';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, username, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const usernameEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const usernamePasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                username,
                usernamePasswordHash,
                usernameEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            const newPassword = 'my-password-1234';

            const newPasswordDerivedKey = lib.getPasswordDerivedKey(newPassword, username, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const newUsernameEncryptedSeed = lib.encrypt(newPasswordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const newUsernamePasswordHash = lib.getPasswordHash(newPasswordDerivedKey, newPassword);

            const updateData = {
                username,
                usernamePasswordHash: newUsernamePasswordHash,
                usernameEncryptedSeed: newUsernameEncryptedSeed
            };

            const expiredOn = Math.round(new Date().getTime() / 1000) + 60 * 5;
            const messageParams = [
                { type: 'string', name: 'project', value: 'GeesomeWallet'},
                { type: 'string', name: 'action', value: 'updateWallet'},
                { type: 'string', name: 'walletData', value: JSON.stringify(updateData)},
                { type: 'string', name: 'expiredOn', value: expiredOn.toString()}
            ];

            console.log('ethereumWallet.address', ethereumWallet.address);
            const signature = lib.signMessage(ethereumWallet.privateKey, messageParams);

            const {wallet} = await appService.updateWallet(ethereumWallet.address, signature, updateData, expiredOn);

            const previousEmailWallet = await appService.getWalletByEmailAndPasswordHash(username, usernamePasswordHash);
            assert.equal(previousEmailWallet, null);

            const gotWallet = await appService.getWalletByUsernameAndPasswordHash(updateData.username, newUsernamePasswordHash);
            assert.equal(gotWallet.username, updateData.username);
            assert.equal(gotWallet.usernamePasswordHash, updateData.usernamePasswordHash);
            assert.equal(gotWallet.usernameEncryptedSeed, updateData.usernameEncryptedSeed);

            done();
        })()
    });

    it("should deleteWallet correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);
            appService.setAdminsAddresses([adminWallet.address]);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const email = 'my1@email.com';
            const password = 'my-password-123';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, email, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const emailEncryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const emailPasswordHash = lib.getPasswordHash(passwordDerivedKey, password);

            const resultWallet = await appService.createWallet({
                email,
                emailPasswordHash,
                emailEncryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            const messageParams = [
                { type: 'string', name: 'project', value: 'GeesomeWallet'},
                { type: 'string', name: 'action', value: 'deleteWallet'},
                { type: 'string', name: 'walletId', value: resultWallet.id.toString()}
            ];

            console.log('ethereumWallet.address', ethereumWallet.address);

            const incorrectSignature = lib.signMessage(adminWallet.privateKey, messageParams);
            try {
                await appService.deleteWallet(resultWallet.id, incorrectSignature);
                assert.equal(false, true);
            } catch (e) {
                assert.equal(e.message.indexOf('not_valid') > -1, true);
            }

            const signature = lib.signMessage(ethereumWallet.privateKey, messageParams);

            await appService.deleteWallet(resultWallet.id, signature);

            const gotWallet = await appService.getWalletByEmailAndPasswordHash(email, emailPasswordHash);
            assert.equal(gotWallet, null);

            done();
        })()
    });
});
