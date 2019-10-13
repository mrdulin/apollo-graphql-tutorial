import { IResolvers } from 'graphql-tools';
import { IAppContext } from './appContext';
import { GraphQLEnumType } from 'graphql';

const DeviceEnum = new GraphQLEnumType({
  name: 'Device',
  values: {
    UNKNOWN: { value: 'Other' },
    DESKTOP: { value: 'Computers' },
    HIGH_END_MOBILE: { value: 'Mobile devices with full browsers' },
    TABLET: { value: 'Tablets with full browsers' },
    CONNECTED_TV: { value: 'Devices streaming video content to TV screens' },
  },
});

export const resolvers: IResolvers = {
  Device: {
    UNKNOWN: 'Other',
    DESKTOP: 'Computers',
    HIGH_END_MOBILE: 'Mobile devices with full browsers',
    TABLET: 'Tablets with full browsers',
    CONNECTED_TV: 'Devices streaming video content to TV screens',
  },

  // Device: DeviceEnum,

  Query: {
    async campaignPerformanceReports(_, __, { db }: IAppContext) {
      return db.campaignPerformanceReports;
    },
    // https://stackoverflow.com/questions/58394659/cant-custom-value-of-graphql-enum#58396460
    async someQuery(_, { device }) {
      console.log(`device=${device}`);
      return device;
    },
  },
};
