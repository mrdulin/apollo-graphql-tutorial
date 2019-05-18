import { IResolvers } from 'apollo-server';
import { IAppContext } from '../../server';

const resolvers: IResolvers = {
  Query: {
    userById: (_, { id }, { dataSources }: IAppContext) => {
      return dataSources.user.findById(id);
    },
  },
  User: {
    userAddress: (source, args, { dataSources }: IAppContext) => {
      return dataSources.address.findById(source.userAddressId);
    },
  },
};

export { resolvers };
