import { IResolvers } from 'graphql-tools';
import { IAppContext } from './server';

const resolvers: IResolvers = {
  Query: {
    userById: (_, { id }, { userRepositoryImpl }: IAppContext) => {
      return userRepositoryImpl.findById(id);
    },
  },
};

export { resolvers };
