import { gql } from 'apollo-server';

const typeDefs = gql`
  type Address {
    address_id: ID!
    address_country: String
    address_state: String
    address_city: String
  }

  extend type Query {
    addressById(id: ID!): Address
  }
`;

export { typeDefs };
