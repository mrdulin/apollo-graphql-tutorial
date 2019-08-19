import { IResolvers } from 'apollo-server';
import { Role } from './db';
import { combineResolvers, isAuthenticated, isAuthorized } from './fp';
import { defaultFieldResolver } from 'graphql';

const resolversWIthCombineResolvers: IResolvers = {
  Query: {
    user: combineResolvers(
      isAuthenticated,
      isAuthorized([Role.admin, Role.editor, Role.viewer]),
      (_, { id }, { db }) => {
        return db.users.find((user) => user.id.toString() === id);
      },
    ),
    posts: (_, { ids }, { db }) => {
      return db.posts.filter((post) => ids.includes(post.id.toString()));
    },
    adminUsers: combineResolvers(isAuthenticated, isAuthorized([Role.admin]), (_, __, { db }) => {
      return db.users.find((user) => user.role === Role.admin);
    }),
    config: combineResolvers(isAuthenticated, isAuthorized([Role.admin, Role.editor, Role.viewer]), () => {
      return { url: 'https://github.com/mrdulin' };
    }),
  },
  Mutation: {
    createPost: combineResolvers(isAuthenticated, isAuthorized([Role.admin]), (_, { input }, { db }) => {
      const post = {
        id: db.posts.length,
        ...input,
      };
      db.posts.push(post);
      return { code: 0, message: 'ok' };
    }),

    createUser: combineResolvers(isAuthenticated, isAuthorized([Role.admin]), (_, { input }, { db }) => {
      const user = {
        id: db.users.length,
        ...input,
      };
      db.users.push(user);
      return { code: 0, message: 'ok' };
    }),
  },

  User: {
    bitcoinAddress: combineResolvers(isAuthenticated, isAuthorized([Role.admin]), defaultFieldResolver),
  },

  Post: {
    author: (post, _, { db }) => {
      return db.users.find((user) => user.id === post.authorId);
    },
  },
};

export { resolversWIthCombineResolvers };
