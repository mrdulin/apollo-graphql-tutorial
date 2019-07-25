import { IResolvers } from 'graphql-tools';
import faker from 'faker';

const resolvers: IResolvers = {
  Query: {
    posts: (_, __, { db }) => {
      return db.posts;
    },
  },

  Mutation: {
    addPost: (_, { post }, { db }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPost = Object.assign({}, post, { postId: faker.random.uuid() });
          db.posts.push(newPost);
          resolve({ code: 0, message: 'add post success' });
        }, 3000);
      });
    },
  },
};
export { resolvers };
