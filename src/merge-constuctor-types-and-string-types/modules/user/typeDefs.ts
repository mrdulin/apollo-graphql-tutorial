import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
    posts: [Post]!
  }

  type Query {
    user(id: ID!): User
  }
`;
