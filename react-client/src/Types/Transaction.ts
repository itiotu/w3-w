export type TransactionProps = {
    from: string;
    to: string;
    amount: string,
    type: TransactionType
}

export enum TransactionType {
    IN = 'in',
    OUT = 'out'
}
