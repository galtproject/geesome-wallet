/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { IGWallet, IGDatabase } from "../../database/interface";

export interface IGAppService {
    database: IGDatabase;

    createWallet(walletData): Promise<IGWallet>;

    getCryptoMetadataByEmail(email): Promise<any>;

    getCryptoMetadataByPhone(phone): Promise<any>;

    getWalletByEmailAndPasswordHash(email, emailPasswordHash): Promise<IGWallet>;

    getWalletByPhoneAndPasswordHash(phone, phonePasswordHash): Promise<IGWallet>;

    updateWallet(primaryAddress, signature, walletData, expiredOn): Promise<IGWallet>;
}