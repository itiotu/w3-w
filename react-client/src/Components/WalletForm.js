import React, {useState} from 'react';
import {Button, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";

export const WalletForm = (props) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleSubmit = (e) => {
		e.preventDefault();
		const passphrase = e.target.elements.passphrase.value;
		props.handleSubmit(passphrase);
		handleClose();
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
					<Modal.Title>Submit passphrase to {props.button.toLowerCase()} </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit} id="retrieve">
						<InputGroup className="mb-3">
							<InputGroup.Text id="basic-addon1">Passphrase</InputGroup.Text>
							<Form.Control
								aria-label="Passphrase"
								aria-describedby="basic-addon1"
								name="passphrase"
								type="password"
							/>
						</InputGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" type="submit" form="retrieve">
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
