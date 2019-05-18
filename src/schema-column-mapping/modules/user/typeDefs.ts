import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    user_id: ID!
    user_nme: String
    user_email: String!
    user_address: Address
  }

  extend type Query {
    userById(id: ID!): User
  }
`;

export { typeDefs };
