import Web3Service from "../Web3/Web3Service";
import { Subscription } from "web3-core-subscriptions";
import { Transaction } from "web3-core";
import WalletService from "../Wallet/WalletService";
import { TransactionService } from "../Transaction/TransactionService";

export default class AlchemySocket {
    private static registeredWebsocket: Map<string, string> = new Map();

    static hasListenerForWallet(walletAddress: string): boolean {
        return this.registeredWebsocket.has(walletAddress);
    }

    static registerWallet(walletAddress: string, subscriptionId: string): void {
        this.registeredWebsocket.set(walletAddress, subscriptionId);
    }

    static registerSocketTransactionListener(walletAddress: string): Subscription<Transaction> | null {

        if (this.hasListenerForWallet(walletAddress)) {
            return null;
        }
        const subscription = Web3Service.getInstance().eth.subscribe(
            'alchemy_filteredFullPendingTransactions',
            {address : walletAddress}
        )
        this.registerWallet(walletAddress, subscription.id);

        return subscription;
    }

    static async registerListenersForAllWallets() {
        const wallets = await WalletService.getAllWallets();
        wallets.forEach(wallet => TransactionService.registerTransactionSubscriber(wallet.address));
    }

}
