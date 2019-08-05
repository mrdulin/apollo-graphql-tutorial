import * as Knex from 'knex';
import faker from 'faker';

export async function seed(knex: Knex): Promise<any> {
  await knex('users')
    .del()
    .insert([
      { user_id: 1, user_nme: faker.name.findName(), user_email: faker.internet.email(), user_friend_ids: [2, 3] },
      { user_id: 2, user_nme: faker.name.findName(), user_email: faker.internet.email(), user_friend_ids: [1] },
      { user_id: 3, user_nme: faker.name.findName(), user_email: faker.internet.email(), user_friend_ids: [1] },
    ]);

  await knex
    .del()
    .insert([
      { post_id: 1, post_title: faker.lorem.sentence(), post_content: faker.lorem.paragraphs(), user_id: 1 },
      { post_id: 2, post_title: faker.lorem.sentence(), post_content: faker.lorem.paragraphs(), user_id: 1 },
      { post_id: 3, post_title: faker.lorem.sentence(), post_content: faker.lorem.paragraphs(), user_id: 2 },
    ])
    .into('posts');

  await knex('tags')
    .del()
    .insert([
      { tag_id: 1, tag_nme: faker.lorem.word(), post_id: 1 },
      { tag_id: 2, tag_nme: faker.lorem.word(), post_id: 1 },
      { tag_id: 3, tag_nme: faker.lorem.word(), post_id: 2 },
    ]);

  await knex.raw(
    `
      SELECT setval(\'users_user_id_seq\', (SELECT MAX(user_id) from "users"))
      UNION
      SELECT setval(\'posts_post_id_seq\', (SELECT MAX(post_id) from "posts"))
      UNION
      SELECT setval(\'tags_tag_id_seq\', (SELECT MAX(tag_id) from "tags"))
    `,
  );
}
