import {Alert, Row} from "react-bootstrap";
import React from "react";
import {IErrorProps} from "../Types/Error";

export const Error = (props: IErrorProps) => {
	return (
		<Row>
			<Alert key={props.variant} variant={props.variant} show={props.show}>
				{props.error}
			</Alert>
		</Row>
	);
}


