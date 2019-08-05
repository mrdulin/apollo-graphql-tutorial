import { IResolvers } from 'apollo-server';
import { IAppContext } from './interfaces/apollo-server/context';
import { IPostInput } from './interfaces/modules/post/postInput';
import { Transaction } from 'knex';
import { ID } from './interfaces/common/types';

const resolvers: IResolvers = {
  User: {
    userPosts: (user, _, { PostLoader }: IAppContext) => {
      return PostLoader.userPosts.load(user.userId);
    },
    userFriends: (user, _, { UserLoader }: IAppContext) => {
      return UserLoader.userFriends.loadMany(user.userFriendIds);
    },
  },
  Post: {
    postAuthor: (post, _, { PostLoader }: IAppContext) => {
      return PostLoader.postAuthor.load(post.postId);
    },
    postTags: (post, _, { PostLoader }: IAppContext) => {
      return PostLoader.postTags.load(post.postId);
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
    posts: (_, { ids }: { ids?: ID[] }, { knex }: IAppContext) => {
      const query = knex('posts').select();
      if (ids) {
        query.whereIn('post_id', ids);
      }
      return query;
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
