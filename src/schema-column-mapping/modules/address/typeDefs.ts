import { gql } from 'apollo-server';

const typeDefs = gql`
  type Address {
    addressId: ID!
    addressCountry: String
    addressState: String
    addressCity: String
  }

  extend type Query {
    addressById(id: ID!): Address
  }
`;

export { typeDefs };
