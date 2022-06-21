import React, {useState, useContext} from 'react';
import {Button, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {WalletPassphraseContext} from "../Context/WalletPassphraseContext";
import {Error} from "./Error";
import {useEffect} from "react";
import {SocketIoContext} from "../Context/SocketContext";


export const TransactionForm = (props) => {
	const [show, setShow] = useState(false);
	const [error, setError] = useState('');
	const [submitDisabled, setSubmitDisabled] = useState(false);

	const handleClose = () => !setError('') && setShow(false) ;
	const handleShow = () => setShow(true);

	const passphrase = useContext(WalletPassphraseContext);

	const socketIo = useContext(SocketIoContext);

	useEffect(() => {
		socketIo.on('wallet-transaction-error', message => {
			setError(message);
			setSubmitDisabled(false);
		});
		socketIo.on('wallet-transaction-success', message => {
			handleClose(true);
			setSubmitDisabled(false);
			setError('');
		})
		return () => {
			socketIo.off('wallet-transaction-error');
			socketIo.off('wallet-transaction-success');
		}
	}, []) ;

	const handleSubmit = async (e) => {
		setError('');
		setSubmitDisabled(true);
		e.preventDefault();
		socketIo.emit('send-transaction', {
			fromAddress: props.fromAddress,
			toAddress: e.target.elements.address.value,
			amount: e.target.elements.amount.value,
			passphrase: passphrase
		});
	};

	return (
		<>
			<Container>
				<Row>
					<Button variant={props.type} onClick={handleShow}>{props.button}</Button>{' '}
				</Row>
			</Container>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Submit transaction </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Error variant='danger' key='danger' show={error.length > 0} error={error}/>

					<Form onSubmit={handleSubmit} id="send-transaction">
						<InputGroup className="mb-3">
							<InputGroup.Text id="basic-addon1">Address</InputGroup.Text>
							<Form.Control
								aria-label="Address"
								aria-describedby="basic-addon1"
								name="address"
								type="text"
							/>
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
							<Form.Control
								aria-label="Amount"
								aria-describedby="basic-addon1"
								name="amount"
								type="number"
								step="any"
							/>
						</InputGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" type="submit" form="send-transaction" disabled={submitDisabled}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
