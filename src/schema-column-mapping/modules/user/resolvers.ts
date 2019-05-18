import { IResolvers } from 'apollo-server';
import { IAppContext } from '../../server';

const resolvers: IResolvers = {
  Query: {
    userById: (_, { id }, { dataSources }: IAppContext) => {
      return dataSources.user.findById(id);
    },
  },
  User: {
    user_address: (source, args, { dataSources }: IAppContext) => {
      return dataSources.address.findById(source.user_address_id);
    },
  },
};

export { resolvers };
