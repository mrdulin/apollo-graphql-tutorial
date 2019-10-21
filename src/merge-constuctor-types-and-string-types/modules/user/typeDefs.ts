import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String

    # Use constructor type 'postType'
    posts: [Post]!
  }

  type Query {
    user(id: ID!): User
  }
`;
