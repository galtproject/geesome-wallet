import {IGPendingWallet, IGWallet} from "../database/interface";

export interface ConfirmWalletData {
    confirmationMethod: ConfirmMethod;
    value: string;
    code: string;
}

export interface ResendConfirmationData {
    confirmationMethod: ConfirmMethod;
}

export interface WalletsResponse {
    wallet?: IGWallet;
    pendingWallet?: IGPendingWallet;
}

export interface PendingWalletResponse {
    pendingWallet?: IGPendingWallet;
}

enum ConfirmMethod {
    EMAIL = 'email',
    PHONE = 'phone',
}

export interface EmailData {
    email: string;
}

export interface PhoneData {
    phone: string;
}

export interface UsernameData {
    username: string;
}

export interface CryptoMetadata {
    derivationPath: string,
    iterations: number,
    kdf: string,
    cryptoCounter: number,
    version: number
}

export interface EmailLoginData {
    email: string;
    emailPasswordHash: string;
}

export interface PhoneLoginData {
    phone: string;
    phonePasswordHash: string;
}

export interface UsernameLoginData {
    username: string;
    usernamePasswordHash: string;
}

export interface PrimaryAddressData {
    primaryAddress: string;
}

export interface SignatureData {
    primaryAddress: string;
    signature: string;
}

export interface SessionData {
    secret: string;
    wallet: IGWallet;
}

export interface UpdateWalletData {
    primaryAddress: string;
    signature: string;
    expiredOn: number;
    walletData: IGWallet;
}

export interface ConfirmWalletAdminData {
    signature: string;
    pendingWalletId: number;
    confirmMethods: ConfirmMethod[];
}

export interface SuccessData {
    success: boolean;
}