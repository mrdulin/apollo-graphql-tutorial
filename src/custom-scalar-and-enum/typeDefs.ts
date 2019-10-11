import { gql } from 'apollo-server';

export const typeDefs = gql`
  enum Device {
    UNKNOWN
    DESKTOP
    HIGH_END_MOBILE
    TABLET
    CONNECTED_TV
  }

  type CampaignPerformanceReport {
    campaignNme: String!
    campaignId: ID!
    device: Device
  }

  type Query {
    campaignPerformanceReports: [CampaignPerformanceReport]!
  }
`;
