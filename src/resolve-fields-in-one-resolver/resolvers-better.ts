import { IResolvers } from 'graphql-tools';

const resolversBetter: IResolvers = {
  Query: {
    async postById(_, { id }, { memoryDB }) {
      return memoryDB.posts.find((post) => post.postId === id);
    },
    async posts(_, __, { memoryDB }) {
      return memoryDB.posts;
    },
  },
  Post: {
    async postAuthor(source, _, { memoryDB }) {
      console.count('resolve Post.postAuthor');
      return memoryDB.users.find((user) => user.userId === source.postAuthorId);
    },
  },
};

export { resolversBetter };
