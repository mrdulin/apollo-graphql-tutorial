import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User

    # == For testing dataloader which disabled cache ==
    authorName1: String
    authorName2: String
    authorName3: String
  }
  type Query {
    users: [User]!
    post(id: ID!): Post
    posts: [Post]!
  }
`;

export { typeDefs };
