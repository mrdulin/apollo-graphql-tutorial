import { IResolvers } from 'apollo-server';

const resolvers: IResolvers = {
  Query: {
    uploads: (_, args) => {
      return '';
    },
  },
  Mutation: {
    singleUpload: async (_, { upload }) => {
      const { file } = await upload;
    },
  },
};

export { resolvers };
