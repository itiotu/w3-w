import Web3Service from "../Web3/Web3Service";
import WalletRepository from "../../repository/Wallet/WalletRepository";
import { Wallet, WalletCurrency, WalletRecord } from "../../types/Wallet";
import { TransactionService } from "../Transaction/TransactionService";

export default class WalletService {
    static async getWallets(passphrase: string): Promise<Wallet[]> {
        const walletRecords = await WalletRepository.findAll();

        const wallets: Wallet[] = [];
        const web3 = Web3Service.getInstance();

        for (const walletRecord of walletRecords) {
            try {
                const decryptedWallet = web3.eth.accounts.decrypt(walletRecord.encrypted, passphrase);

                wallets.push({
                    address: decryptedWallet.address,
                    balance: web3.utils.fromWei(await web3.eth.getBalance(decryptedWallet.address), 'ether'),
                    currency: WalletCurrency.ETH
                })

            } catch (error) {
                console.log(`Wallet belongs to different passphrase ${walletRecord.address}` )
            }
        }

        return wallets;
    }

    static async getBalance(address: string): Promise<string> {
        const web3 = Web3Service.getInstance();

        return web3.utils.fromWei(await web3.eth.getBalance(address), 'ether')
    }

    static async createWallet(passphrase: string): Promise<Wallet> {
        const web3 = Web3Service.getInstance();

        const latestBlock = await web3.eth.getBlock('latest');
        const wallet = await web3.eth.accounts.create();
        const encryptedWallet = wallet.encrypt(passphrase);

        const walletRecord: WalletRecord = await WalletRepository.save({
            address: wallet.address,
            encrypted: encryptedWallet,
            block: latestBlock.number
        });

        await TransactionService.registerTransactionSubscriber(walletRecord.address);

        return {
            address: walletRecord.address,
            balance: web3.utils.fromWei(await web3.eth.getBalance(walletRecord.address), 'ether'),
            currency: WalletCurrency.ETH
        }
    }

    static async getAllWallets(): Promise<WalletRecord[]> {
        return WalletRepository.findAll();
    }
}
