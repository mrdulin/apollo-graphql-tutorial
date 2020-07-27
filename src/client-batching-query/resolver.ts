import { IResolvers } from 'graphql-tools';
import faker from 'faker';

const resolvers: IResolvers = {
  Query: {
    posts: (_, __, { db }) => {
      return db.posts;
    },
    userById: (_, { id }, { db }) => {
      console.count('Query.userById');
      const user = db.users.find((u) => u.userId.toString() === id);
      return user;
    },
  },
  Post: {
    postAuthor: (parent, _, { db }) => {
      return db.users.find((user) => user.userId.toString() === parent.postAuthorId.toString());
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
