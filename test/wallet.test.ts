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

    it("should set and get values correctly", (done) => {
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
});
