import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: {
    async postById(_, { id }, { memoryDB }) {
      const postFound = memoryDB.posts.find((post) => post.postId === id);
      if (postFound) {
        const postAuthor = memoryDB.users.find((user) => user.userId === postFound.postAuthorId);
        postFound.postAuthor = postAuthor;
      }
      return postFound;
    },
    async posts(_, __, { memoryDB }) {
      return memoryDB.posts.map((post) => {
        post.postAuthor = memoryDB.users.find((user) => user.userId === post.postAuthorId);
        return post;
      });
    },
  },
};

export { resolvers };
