import { IResolvers } from 'apollo-server';
import { IAppContext } from '../../server';

const resolvers: IResolvers = {
  Query: {
    userById: (_, { id }, { dataSources }: IAppContext) => {
      return dataSources.user.findById(id);
    },
    users: (_, __, { dataSources }: IAppContext) => {
      return dataSources.user.findAll();
    },
  },
  User: {
    userAddress: (source, _, { dataSources }: IAppContext) => {
      return dataSources.address.findById(source.userAddressId);
    },
  },
};

export { resolvers };
