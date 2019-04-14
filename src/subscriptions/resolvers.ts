import { IConnectors } from './connectors';
import { IMemoryDB } from './datasources/memoryDB';

const resolvers = {
  Query: {
    templates: (_, __, { templateConnector }: IConnectors<IMemoryDB>) => {
      return templateConnector.getAll();
    },

    locationsByOrgId: (_, { id }, { locationConnector }: IConnectors<IMemoryDB>) => {
      return locationConnector.findLocationsByOrgId(id);
    }
  }
};

export { resolvers };
