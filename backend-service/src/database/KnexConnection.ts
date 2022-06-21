import config from '../../knexfile';
import knex, { Knex } from 'knex';

export default class KnexConnection {
    public static instance: Knex;

    connect(): Knex {
        try {
            const connection = knex(config);

            console.log('Connected to database');

            return connection;
        } catch (error) {
            let message = 'Unable to connect to database';

            if (error instanceof Error) {
                message += `: ${error.message}`;
            }
            console.log(message);

            return this.connect();
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new KnexConnection().connect();
        }

        return this.instance;
    }
}
