import KnexConnection from "../../database/KnexConnection";
import { TransactionRecord } from "../../types/Transaction";

export default class TransactionRepository {
    static async save(transaction: TransactionRecord): Promise<TransactionRecord> {
        const knex = await KnexConnection.getInstance();
        const response = await knex<TransactionRecord>('transaction').insert(transaction).returning('*');

        if (response[0]) {
            return response[0];
        }

        throw new Error('Could not insert transaction details into database.');
    }

    static async update(transaction: TransactionRecord): Promise<TransactionRecord> {
        const knex = await KnexConnection.getInstance();
        const response = await knex<TransactionRecord>('transaction').update(transaction).where({ id: transaction.id }).returning('*');

        if (response[0]) {
            return response[0];
        }

        throw new Error('Could not update transaction details into database.');
    }

    static async findAllForWalletAddress(address: string): Promise<TransactionRecord[]> {
        const knex = await KnexConnection.getInstance();

        return knex<TransactionRecord>('transaction').select().where({address: address});
    }

    static async findByTxHash(txHash: string): Promise<TransactionRecord[]> {
        const knex = await KnexConnection.getInstance();

        return knex<TransactionRecord>('transaction').select().where({txHash: txHash});
    }
}
