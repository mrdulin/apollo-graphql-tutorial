import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('users', (t: Knex.TableBuilder) => {
    t.increments('user_id');
    t.string('user_nme', 50).notNullable();
    t.string('user_email', 50)
      .unique()
      .notNullable();
    t.specificType('friend_ids', 'INTEGER[]');
  });

  await knex.schema.createTable('posts', (t: Knex.TableBuilder) => {
    t.increments('post_id');
    t.string('post_title')
      .unique()
      .notNullable();
    t.text('post_content').notNullable();
    t.timestamp('post_created_at', { precision: 6 }).defaultTo(knex.fn.now());
    t.timestamp('post_updated_at', { precision: 6 }).defaultTo(knex.fn.now());

    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users');
  });

  await knex.schema.createTable('tags', (t: Knex.TableBuilder) => {
    t.increments('tag_id');
    t.string('tag_nme', 50);

    t.integer('post_id')
      .unsigned()
      .notNullable()
      .references('post_id')
      .inTable('posts')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema
    .dropTableIfExists('tags')
    .dropTableIfExists('posts')
    .dropTableIfExists('users');
}
