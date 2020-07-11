/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGWallet, IGDatabase, IGPendingWallet, IGAuthMessage} from "../../database/interface";

export interface IGAppService {
    adminsAddresses: string[];

    database: IGDatabase;

    register(walletData): Promise<{wallet?: IGWallet, pendingWallet?: IGPendingWallet}>;

    createPendingWallet(walletData): Promise<IGPendingWallet>;

    createWallet(walletData): Promise<IGWallet>;

    getCryptoMetadataByEmail(email): Promise<any>;

    getCryptoMetadataByPhone(phone): Promise<any>;

    getCryptoMetadataByUsername(phone): Promise<any>;

    getWalletByEmailAndPasswordHash(email, emailPasswordHash): Promise<IGWallet>;

    getWalletByPhoneAndPasswordHash(phone, phonePasswordHash): Promise<IGWallet>;

    getWalletByUsernameAndPasswordHash(username, phonePasswordHash): Promise<IGWallet>;

    getAuthMessage(primaryAddress): Promise<IGAuthMessage>;

    getWalletBySignature(primaryAddress, signature): Promise<IGWallet>;

    updateWallet(primaryAddress, signature, walletData, expiredOn): Promise<{pendingWallet: IGPendingWallet, wallet: IGWallet}>;

    setAdminsAddresses(adminsAddresses: string[]);

    confirmPendingWalletByAdmin(signature, pendingWalletId, confirmMethods?);

    confirmPendingWalletByCode(pendingWalletId, confirmationMethod, value, code);

    resendConfirmationCode(confirmationMethod, pendingWalletId);
}