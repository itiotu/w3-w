export type Wallet = {
    address: string;
    currency: string;
    balance: string;
}

export type WalletFormProps = {
    button: string;
    type:string;
    handleSubmit: Function
}
