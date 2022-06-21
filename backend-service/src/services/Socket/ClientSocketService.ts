import { Server, Socket } from "socket.io";
import { httpServer } from "../../index";
import WalletService from "../Wallet/WalletService";
import { TransactionService } from "../Transaction/TransactionService";
import { TransactionConfig } from "../../types/Transaction";
import { getKeyByValue } from "../../utils/UtilityFunctions";

export default class ClientSocketService {
    public static instance: Server;

    static registeredClientSockets: Map<string, string> = new Map();

    static getInstance() {
        if (!this.instance) {
            this.instance = ClientSocketService.init();
        }

        return this.instance;
    }

    static init() {
        const io = new Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN,
                methods: process.env.CORS_METHODS!.split(',')
            }
        });

        io.on("connection", socket => this.registerEventsOnSocket(socket));

        return io;
    }

    private static registerEventsOnSocket(socket: Socket) {
        this.registerWalletListingEvent(socket);

        this.registerWalletCreateEvent(socket);

        this.registerWalletTransactionListingEvent(socket);

        this.registerWalletTransactionSubmitEvent(socket);

        this.registerDisconnectCleanupEvent(socket);
    }

    private static registerDisconnectCleanupEvent(socket: Socket): void {
        socket.on("disconnect", (reason) => {
            console.log('Client disconnected');
            socket.removeAllListeners('retrieve-wallet');
            socket.removeAllListeners('create-wallet');
            socket.removeAllListeners('retrieve-wallet-transactions');
            socket.removeAllListeners('send-transaction');
            getKeyByValue(this.registeredClientSockets, socket.id).forEach(wallet => this.registeredClientSockets.has(wallet) && this.registeredClientSockets.delete(wallet));
        });
    }

    private static registerWalletTransactionSubmitEvent(socket: Socket): void {
        socket.on('send-transaction', async (transactionConfig: TransactionConfig) => {
            try {
                await TransactionService.send(transactionConfig);
                socket.emit('wallet-transaction-success', true);
            } catch (error) {
                let message = 'Unknown error';
                if (error instanceof Error) {
                    message = error.message;
                }
                socket.emit('wallet-transaction-error', message);
            }
        })
    }

    private static registerWalletTransactionListingEvent(socket: Socket): void {
        socket.on('retrieve-wallet-transactions', async (address) => {
            const transactions = await TransactionService.getAllTransactionsForWallet(address);
            socket.emit('wallet-transactions', {wallet: address, transactions: transactions});
        })
    }

    private static registerWalletCreateEvent(socket: Socket): void {
        socket.on('create-wallet', async (passphrase) => {
            try {
                const wallet = await WalletService.createWallet(passphrase);
                socket.emit('wallet-created', wallet);
                this.registeredClientSockets.set(wallet.address, socket.id)
            } catch (error) {
                let message = 'Unknown error';
                if (error instanceof Error) {
                    message = error.message;
                }
                socket.emit('wallet-create-error', message);
            }
        })
    }

    private static registerWalletListingEvent(socket: Socket): void {
        socket.on('retrieve-wallet', async (passphrase) => {
            const wallets = await WalletService.getWallets(passphrase);
            socket.emit('wallet-listing', wallets);
            wallets.forEach(wallet => this.registeredClientSockets.set(wallet.address, socket.id));
        })
    }
}
