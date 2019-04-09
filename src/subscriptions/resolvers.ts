import { IConnectors } from './connectors';
import { IMemoryDB, ILocation, ITemplate } from './datasources/memoryDB';
import { ICommonResponse } from './models/CommonResponse';

const resolvers = {
  Query: {
    templates: (_, __, { templateConnector }: IConnectors<IMemoryDB>): ITemplate[] => {
      return templateConnector.findAll();
    },

    templateById: (_, { id }, { templateConnector }: IConnectors<IMemoryDB>): ITemplate | undefined => {
      return templateConnector.findById(id);
    },

    locationsByOrgId: (_, { id }, { locationConnector }: IConnectors<IMemoryDB>): ILocation[] => {
      return locationConnector.findLocationsByOrgId(id);
    }
  },

  Mutation: {
    editTemplate: (_, { templateInput }, { templateConnector }: IConnectors<IMemoryDB>): ICommonResponse => {
      return templateConnector.edit(templateInput);
    }
  }
};

export { resolvers };
