import { IResolvers } from 'apollo-server';
import { IAppContext } from '../../server';

const resolvers: IResolvers = {
  Query: {
    addressById: (_, { id }, { dataSources }: IAppContext) => {
      return dataSources.address.findById(id);
    },
  },
};

export { resolvers };
