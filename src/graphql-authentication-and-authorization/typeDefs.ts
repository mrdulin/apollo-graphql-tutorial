import { gql } from 'apollo-server';

const typeDefs = gql`
  enum Role {
    admin
    viewer
    editor
  }

  type User {
    id: ID!
    name: String
    email: String!
    role: Role
    bitcoinAddress: String
  }

  input CreateUserInput {
    name: String
    email: String!
    role: Role!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    author: User
  }

  type Config {
    url: String!
  }

  input CreatePostInput {
    title: String!
    content: String!
  }

  type Query {
    user(id: ID!): User
    posts(ids: [ID!]!): [Post]!

    adminUsers: [User]!
    config: Config
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): CommonResponse!
    createUser(input: CreateUserInput!): CommonResponse!
  }
`;

export { typeDefs };
