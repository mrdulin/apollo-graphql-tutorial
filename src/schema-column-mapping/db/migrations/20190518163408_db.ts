import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('addresses', (t: Knex.TableBuilder) => {
    t.increments('address_id');
    ['address_city', 'address_country', 'address_state'].forEach((col: string) => {
      t.string(col);
    });
  });
  await knex.schema.createTable('users', (t: Knex.TableBuilder) => {
    t.increments('user_id');
    t.string('user_nme').nullable();
    t.string('user_email')
      .unique()
      .notNullable();

    t.integer('user_address_id').unsigned();
    t.foreign('user_address_id')
      .references('address_id')
      .inTable('addresses');
  });
}

export async function down(knex: Knex): Promise<any> {
  await Promise.all(['users', 'addresses'].map((tableName: string) => knex.schema.dropTable(tableName)));
}
