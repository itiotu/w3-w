import React, {useState, useEffect} from "react";
import {Row, Col, Container, Card} from 'react-bootstrap';
import {WalletTransaction} from "./WalletTransaction";
import {TransactionForm} from "./TransactionForm";
import {useContext} from "react";
import {SocketIoContext} from "../Context/SocketContext";

export const WalletEntry = (props) => {

	const [transactions, setTransactions] = useState([]);
	const [balance, setBalance] = useState(props.item.balance);

	const socketIo = useContext(SocketIoContext);

	useEffect(() => {
		socketIo.emit('retrieve-wallet-transactions', props.item.address);

		socketIo.on('wallet-transactions', data => {
			if (data.transactions.length > 0 && data.wallet === props.item.address) {
				setTransactions(data.transactions);
			}
		});

		socketIo.on('balance-update', data => {
			if (data.wallet === props.item.address) {
				setBalance(data.balance)
			}
		});

		return () => {
			socketIo.off('retrieve-wallet-transactions');
			socketIo.off('new-transaction');
		}
	}, []) ;

	return (
		<Card className="mt-3">
			<Container className="mx-3 my-3">
				<Row>
					<Col>Wallet Address: {props.item.address}</Col>
					<Col xs={6}></Col>
				</Row>
				<Row>
					<Col>Balance: {props.item.currency.toUpperCase()} {balance} </Col>
				</Row>

				<Row>
					Transactions
					{transactions.map((transaction, index) => {
						return <Row key={index}>
							<WalletTransaction item={transaction} />
						</Row>
					})}
				</Row>
				<Row>
					<Col className='col-md-3 offset-md-4 mt-3'>
						<TransactionForm button="Submit Transaction" type="primary" fromAddress={props.item.address} />
					</Col>
				</Row>
			</Container>
		</Card>
	);
}
