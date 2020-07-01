/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

export interface IGDatabase {
    sequelize;

    flushDatabase(): Promise<void>;

    addWallet(wallet): Promise<IGWallet>;
    getWallet(id): Promise<IGWallet>;
    getWalletByEmail(email): Promise<IGWallet>;
    getWalletByField(fieldName, fieldValue): Promise<IGWallet>;
    getWalletByEmailAndPasswordHash(email, emailPasswordHash): Promise<IGWallet>;
    getWalletByPhoneAndPasswordHash(phone, phonePasswordHash): Promise<IGWallet>;
    getWalletByPrimaryAddress(primaryAddress): Promise<IGWallet>;

    updateWallet(walletData): Promise<any>;
}

export interface IGWallet {
    id;
    email;
    username;
    phone;
    primaryAddress;
    emailPasswordHash;
    phonePasswordHash;
    emailEncryptedSeed;
    phoneEncryptedSeed;
    cryptoMetadataJson;
}