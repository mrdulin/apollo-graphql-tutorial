import { IResolvers } from 'apollo-server';
import { Role } from './db';

const resolvers: IResolvers = {
  Query: {
    user: (_, { id }, { db }) => {
      return db.users.find((user) => user.id.toString() === id);
    },
    posts: (_, { ids }, { db }) => {
      return db.posts.filter((post) => ids.includes(post.id.toString()));
    },
    adminUser: (_, __, { db }) => {
      return db.users.find((user) => user.role === Role.admin);
    },
    config: () => {
      return { url: 'https://github.com/mrdulin' };
    },
  },
  Mutation: {
    createPost: (_, { input }, { db }) => {
      const post = {
        id: db.posts.length,
        ...input,
      };
      db.posts.push(post);
      return { code: 0, message: 'ok' };
    },

    createUser: (_, { input }, { db }) => {
      const user = {
        id: db.users.length,
        ...input,
      };
      db.users.push(user);
      return { code: 0, message: 'ok' };
    },
  },

  Post: {
    author: (post, _, { db }) => {
      return db.users.find((user) => user.id === post.authorId);
    },
  },
};

export { resolvers };
