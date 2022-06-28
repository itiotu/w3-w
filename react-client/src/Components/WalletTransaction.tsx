import {Col} from "react-bootstrap";
import React from "react";
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import {TransactionProps} from "../Types/Transaction";

export const WalletTransaction = (props: {item: TransactionProps}) => {

	function TransactionIcon() {
		if (props.item.type === 'in') {
			return <BsFillArrowDownCircleFill />;
		}
		return <BsFillArrowUpCircleFill />;
	}

	return (
		<Col> <TransactionIcon/> From: {props.item.from} To: {props.item.to} Amount: {props.item.amount}</Col>
	);
}
