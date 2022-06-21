import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallet', (table) => {
        table.increments('id');
        table.string('address', 42).notNullable();
        table.jsonb('encrypted').notNullable();
        table.bigint('block').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallet');
}

