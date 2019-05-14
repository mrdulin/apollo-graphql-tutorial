import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    userId: ID!
    userNme: String
    userEmail: String
    userAddress: Address
  }

  type Address {
    addressCountry: String
    addressCity: String
    addressStreet: String
  }

  type Query {
    userById(id: ID!): User
  }
`;

export { typeDefs };
