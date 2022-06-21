import { EncryptedKeystoreV3Json } from "web3-core";

export type WalletRecord = {
    id?: number;
    address: string;
    encrypted: EncryptedKeystoreV3Json,
    block: number
}

export type Wallet = {
    address: string;
    balance: string;
    currency: WalletCurrency
}

export enum WalletCurrency {
    ETH = 'eth'
}
