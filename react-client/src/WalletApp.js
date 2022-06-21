import React, { useEffect, useState } from 'react';
import { WalletForm } from "./Components/WalletForm";
import { WalletService } from "./Services/WalletService";
import { Row, Col } from 'react-bootstrap';
import { WalletEntry } from './Components/WalletEntry';
import { WalletPassphraseContext } from './Context/WalletPassphraseContext';
import { useContext } from "react";
import { SocketIoContext } from "./Context/SocketContext";
import { Error } from "./Components/Error";

export function WalletApp() {
	const [passphrase, setPassphrase] = useState('');
	const [wallets, setWallets] = useState([]);
	const [error, setError] = useState('');

	const socketIo = useContext(SocketIoContext);

	const handleCreateWalletSubmit = (passphrase) => {
		WalletService.createWallet(passphrase, socketIo);
		setPassphrase(passphrase);
	}

	const handleWalletRetrieveSubmit = (passphrase) => {
		setPassphrase(passphrase);
	}

	useEffect(() => {
		socketIo.on('wallet-listing', data => {
			setWallets(data);
		});

		socketIo.on('wallet-created', data => {
			if (!data) {
				return setError('Could not create wallet.');
			}
			setWallets([...wallets, data]);
			setError('');
		});

		socketIo.on('wallet-create-error', message => {
			setError(message);
		})

		return () => {
			socketIo.off('wallet-listing');
			socketIo.off('wallet-created');
			socketIo.off('wallet-create-error');
		}
	}) ;

	useEffect(() => {
		WalletService.handlePassphraseChanges(passphrase, socketIo);
	}, [passphrase, socketIo]) ;

	return (
		<WalletPassphraseContext.Provider value={passphrase}>
			<Error variant='danger' key='danger' show={error.length > 0} error={error}/>
			<Row>
				<Col>
					<WalletForm button="Retrieve Wallets" type="primary" handleSubmit={handleWalletRetrieveSubmit} />
				</Col>
				<Col>
					<WalletForm button="Create Wallet" type="success" handleSubmit={handleCreateWalletSubmit} />
				</Col>
			</Row>
			<Row>
				{wallets.map((wallet) => {
					return <WalletEntry key={wallet.address} item={wallet} />
				})}
			</Row>
		</WalletPassphraseContext.Provider>

	);
}
