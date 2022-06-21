export type Transaction = {
    from: string;
    to: string;
    type: TransactionType;
    amount: string
}

export type TransactionRecord = {
    id?: number;
    address: string;
    txHash: string;
    confirmed: boolean;
}

export enum TransactionType {
    IN = 'in',
    OUT = 'out'
}

export type TransactionConfig = {
    fromAddress: string;
    toAddress: string;
    amount: string;
    passphrase: string
}
