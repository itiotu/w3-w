
export class WalletService {
	static handlePassphraseChanges(passphrase, socketIo) {
		if (passphrase) {
			socketIo.emit('retrieve-wallet', passphrase);
		}
	};

	static createWallet(passphrase, socketIo) {
		socketIo.emit('create-wallet', passphrase);
	}
}
