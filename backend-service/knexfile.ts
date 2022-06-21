import { config as setupEnv } from 'dotenv';

setupEnv();

const config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '5432')
    },
    pool: {
        min: 1,
        max: 1
    },
    debug: process.env.ENABLE_QUERY_DEBUGGING === 'true',
    migrations: {
        directory: './migrations',
        tableName: 'migrations'
    }
};

export default config;
