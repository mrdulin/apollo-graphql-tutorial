import { IResolvers } from 'apollo-server';
import { IAppContext } from '../../server';
import fetch from 'node-fetch';
import { logger } from '../../../util';

const resolvers: IResolvers = {
  Query: {
    userById: async (_, { id }, { dataSources }: IAppContext) => {
      // test GCP cloud trace
      const response = await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
      logger.debug('HTTP request for testing GCP cloud trace', { arguments: { response } });
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
