import { Socket } from "socket.io-client";

export class WalletService {
	static handlePassphraseChanges(passphrase: string, socketIo: Socket) {
		if (passphrase) {
			socketIo.emit('retrieve-wallet', passphrase);
		}
	};

	static createWallet(passphrase: string, socketIo: Socket) {
		socketIo.emit('create-wallet', passphrase);
	}
}
