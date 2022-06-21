import Web3Service from "../Web3/Web3Service";
import WalletRepository from "../../repository/Wallet/WalletRepository";
import { Transaction, TransactionConfig, TransactionRecord, TransactionType } from "../../types/Transaction";
import { Account, TransactionReceipt, Transaction as Web3Transaction } from "web3-core";
import TransactionRepository from "../../repository/Transaction/TransactionRepository";
import WalletService from "../Wallet/WalletService";
import AlchemySocket from "../Socket/AlchemySocket";
import ClientSocketService from "../Socket/ClientSocketService";

export class TransactionService {
    static async getAllTransactionsForWallet(address: string): Promise<Transaction[]> {
        const transactionRecords = await TransactionRepository.findAllForWalletAddress(address);
        const transactions = [];

        for (const transactionRecord of transactionRecords) {
            const blockchainTransaction = await Web3Service.getInstance().eth.getTransaction(transactionRecord.txHash);
            const transaction = this.mapTransaction(blockchainTransaction, address);
            transactions.push(transaction);
        }

        return transactions;
    }

    private static mapTransaction(blockchainTransaction: Web3Transaction, address: string): Transaction {
        let transactionType = TransactionType.IN;
        if (blockchainTransaction.from === address) {
            transactionType = TransactionType.OUT;
        }

        return {
            from: blockchainTransaction.from,
            to: blockchainTransaction.to || '',
            type: transactionType,
            amount: Web3Service.getInstance().utils.fromWei(blockchainTransaction.value, 'ether'),
        };
    }

    static async send(transactionConfig: TransactionConfig): Promise<TransactionReceipt> {
        const walletRecord = await WalletRepository.findOneByAddress(transactionConfig.fromAddress);
        const web3 = Web3Service.getInstance();
        const decryptedWallet = web3.eth.accounts.decrypt(walletRecord.encrypted, transactionConfig.passphrase);

        return this.sendTransaction(transactionConfig, decryptedWallet);
    }

    private static async sendTransaction(transactionConfig: TransactionConfig, decryptedWallet: Account): Promise<TransactionReceipt> {
        const web3 = Web3Service.getInstance();

        const nonce = await web3.eth.getTransactionCount(decryptedWallet.address, 'latest');

        const gasEstimate = await web3.eth.estimateGas({
            "from"      : decryptedWallet.address,
            "nonce"     : nonce,
            "to"        : transactionConfig.toAddress
        });

        const transaction = {
            'to': transactionConfig.toAddress,
            'value': web3.utils.toWei(transactionConfig.amount, 'ether'),
            'gas': gasEstimate,
            'maxPriorityFeePerGas': 0,
            'nonce': nonce
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, decryptedWallet.privateKey);

        if (!signedTransaction.rawTransaction) {
            throw new Error('Cannot sign transaction');
        }

        return web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    }

    static async registerTransactionSubscriber(walletAddress: string) {
       const subscription = AlchemySocket.registerSocketTransactionListener(walletAddress);
       if (subscription) {
           subscription.on('data', (transaction) => {
               this.watchTransaction({address: walletAddress, txHash: transaction.hash, confirmed: false})
           })
       }

    }

    private static async watchTransaction(transactionRecord: TransactionRecord) {
        const alreadyWatchedTransaction = await TransactionRepository.findByTxHash(transactionRecord.txHash);
        if (alreadyWatchedTransaction.length > 0) {
            return;
        }
        const insertedTransactionRecord = await TransactionRepository.save(transactionRecord);

        await this.poolTransactionUntilCompleted(insertedTransactionRecord.txHash);
        insertedTransactionRecord.confirmed = true;
        await TransactionRepository.update(insertedTransactionRecord);

        const transactions = await TransactionService.getAllTransactionsForWallet(insertedTransactionRecord.address);

        const clientSocketId = ClientSocketService.registeredClientSockets.get(insertedTransactionRecord.address) as string;

        ClientSocketService.getInstance().to(clientSocketId).emit('wallet-transactions', {wallet: insertedTransactionRecord.address, transactions: transactions});
        ClientSocketService.getInstance().to(clientSocketId).emit('balance-update', {
            wallet: insertedTransactionRecord.address,
            balance: await WalletService.getBalance(insertedTransactionRecord.address)
        });
    }

    private static async poolTransactionUntilCompleted(transactionHash: string): Promise<boolean> {
        const transactionRecord = await Web3Service.getInstance().eth.getTransaction(transactionHash);

        if (transactionRecord && !transactionRecord.blockNumber) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return this.poolTransactionUntilCompleted(transactionHash);
        }

        return true;
    }
}
