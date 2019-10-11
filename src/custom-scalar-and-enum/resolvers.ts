import { IResolvers } from 'graphql-tools';
import { IAppContext } from './appContext';

export const resolvers: IResolvers = {
  Device: {
    UNKNOWN: 'Other',
    DESKTOP: 'Computers',
    HIGH_END_MOBILE: 'Mobile devices with full browsers',
    TABLET: 'Tablets with full browsers',
    CONNECTED_TV: 'Devices streaming video content to TV screens',
  },
  Query: {
    async campaignPerformanceReports(_, __, { db }: IAppContext) {
      return db.campaignPerformanceReports;
    },
  },
};
