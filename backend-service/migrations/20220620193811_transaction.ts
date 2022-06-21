import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transaction', (table) => {
        table.increments('id');
        table.string('address', 42).notNullable();
        table.string('txHash').notNullable();
        table.boolean('confirmed').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transaction');
}

