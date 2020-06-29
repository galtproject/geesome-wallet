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
    const databaseConfig = {name: 'geesome_wallet_test', options: {logging: true}};

    it("should register and login correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const email = 'my@email.com';
            const password = 'my-password-123';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, email, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const encryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const passwordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                email,
                passwordHash,
                encryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            const gotCryptoMetadata = await appService.getCryptoMetadataByEmail(email);

            const gotPasswordDerivedKey = lib.getPasswordDerivedKey(password, email, gotCryptoMetadata.iterations, gotCryptoMetadata.kdf);
            const gotPasswordHash = lib.getPasswordHash(gotPasswordDerivedKey, password);
            const gotWallet = await appService.getWalletByEmailAndPasswordHash(email, gotPasswordHash);

            assert.deepEqual(passwordHash, gotPasswordHash);
            assert.deepEqual(gotWallet.encryptedSeed, encryptedSeed);

            const gotSeed = lib.decrypt(gotPasswordDerivedKey, gotWallet.encryptedSeed, gotCryptoMetadata.cryptoCounter);

            assert.equal(seed, gotSeed);

            const gotEthereumWallet = lib.getKeypairByMnemonic(gotSeed, 0, gotCryptoMetadata.derivationPath);
            assert.equal(ethereumWallet.address, gotEthereumWallet.address);
            assert.equal(ethereumWallet.privateKey, gotEthereumWallet.privateKey);
            done();
        })()
    });

    it.only("should updateWallet correctly", (done) => {
        (async () => {
            let database = await require('../database/sql')(databaseConfig);
            const appService: IGAppService = await require('../services/appService/v1')(database, null);

            const cryptoMetadata = lib.getDefaultCryptoMetadata();
            const { derivationPath } = cryptoMetadata;

            const seed = lib.generateMnemonic();
            const ethereumWallet = lib.getKeypairByMnemonic(seed, 0, derivationPath);

            const email = 'my@email.com';
            const password = 'my-password-123';

            const passwordDerivedKey = lib.getPasswordDerivedKey(password, email, cryptoMetadata.iterations, cryptoMetadata.kdf);

            const encryptedSeed = lib.encrypt(passwordDerivedKey, seed, cryptoMetadata.cryptoCounter);

            const passwordHash = lib.getPasswordHash(passwordDerivedKey, password);

            await appService.createWallet({
                email,
                passwordHash,
                encryptedSeed,
                primaryAddress: ethereumWallet.address,
                cryptoMetadataJson: JSON.stringify(cryptoMetadata)
            });

            const updateData = {
                email: 'my2@email.com',
                username: 'my-username',
                phone: '+79062174112'
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

            const previousEmailWallet = await appService.getWalletByEmailAndPasswordHash(email, passwordHash);
            assert.equal(previousEmailWallet, null);

            const gotWallet = await appService.getWalletByEmailAndPasswordHash(updateData.email, passwordHash);
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
