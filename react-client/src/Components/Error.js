import {Alert, Row} from "react-bootstrap";
import React from "react";

export const Error = (props) => {
	return (
		<Row>
			<Alert key={props.variant} variant={props.variant} show={props.show}>
				{props.error}
			</Alert>
		</Row>
	);
}


