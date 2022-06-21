import { WalletRecord } from "../../types/Wallet";
import KnexConnection from "../../database/KnexConnection";

export default class WalletRepository {
    static async save(wallet: WalletRecord): Promise<WalletRecord> {
        const knex = await KnexConnection.getInstance();
        const response = await knex<WalletRecord>('wallet').insert(wallet).returning('*');

        if (response[0]) {
            return response[0];
        }

        throw new Error('Could not insert wallet details into database.');
    }

    static async findAll(): Promise<WalletRecord[]> {
        const knex = await KnexConnection.getInstance();

        return knex<WalletRecord>('wallet').select();
    }

    static async findOneByAddress(address: string): Promise<WalletRecord> {
        const knex = await KnexConnection.getInstance();

        const response = await knex<WalletRecord>('wallet').select('*').where('address', address).first();

        if (!response) {
            throw new Error(`Could not find wallet for address ${address}`);
        }

        return response;
    }
}
