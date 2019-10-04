import { gql } from 'apollo-server';

const typeDefs = gql`
  type User @camelizeKeys {
    userId: ID!
    userNme: String
    userEmail: String!
    userAddress: Address
  }

  extend type Query {
    userById(id: ID!): User
    users: [User]!
  }
`;

export { typeDefs };
