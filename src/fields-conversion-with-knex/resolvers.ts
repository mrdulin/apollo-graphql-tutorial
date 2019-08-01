import { IResolvers } from 'apollo-server';
import Knex from 'knex';

const resolvers: IResolvers = {
  Post: {
    postAuthor: (post, _, { knex }) => {
      const sql = `
        select 
          u.* 
        from posts as p
        inner join users as u using(user_id)
        where p.post_id = ?;
      `;
      console.log('[postAuthor] post: ', JSON.stringify(post, null, 2));
      return knex
        .raw(sql, [post.postId])
        .get('rows')
        .get(0);
    },
    postTags: (post, _, { knex }) => {
      const sql = `
        select 
          t.*
        from posts as p
        right join tags as t using(post_id)
        where p.post_id = ?;
      `;
      return knex.raw(sql, [post.postId]).get('rows');
    },
  },
  Query: {
    user: (_, { id }, { knex }) => {
      const sql = `select * from users where user_id = ?;`;
      return knex
        .raw(sql, [id])
        .get('rows')
        .get(0);
    },
    posts: (_, __, { knex }) => {
      const sql = `select * from posts`;
      return knex.raw(sql).get('rows');
    },
    post: (_, { id }, { knex }: { knex: Knex }) => {
      return knex('posts')
        .where({ post_id: id })
        .first();
    },
  },
};

export { resolvers };
