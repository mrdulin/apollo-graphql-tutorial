import { IResolvers } from 'apollo-server';
import { IAppContext } from './interfaces/apollo-server/context';
import { IPostInput } from './interfaces/modules/post/postInput';
import { Transaction } from 'knex';

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
    post: (_, { id }, { knex }: IAppContext) => {
      return knex('posts')
        .where({ post_id: id })
        .first();
    },
  },

  Mutation: {
    post: (_, { postInput }: { postInput: IPostInput }, { knex }: IAppContext) => {
      const commonResponse = { code: 0, message: '' };
      return knex
        .transaction((trx: Transaction) => {
          const post = {
            postTitle: postInput.postTitle,
            postContent: postInput.postContent,
            userId: postInput.postAuthorId,
          };
          knex('posts')
            .transacting(trx)
            .insert(post)
            .returning(['post_id'])
            .then(([postInserted]) => {
              if (postInput.postTags) {
                const tags = postInput.postTags.map((postTag) => {
                  return { tagNme: postTag.tagNme, postId: postInserted.postId };
                });
                return knex('tags')
                  .transacting(trx)
                  .insert(tags);
              }
              return Promise.resolve(postInserted);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(() => {
          commonResponse.message = 'create post success';
          return commonResponse;
        })
        .catch((error) => {
          console.error(error);
          commonResponse.code = 1;
          commonResponse.message = 'create post error';
          return commonResponse;
        });
    },
  },
};

export { resolvers };
