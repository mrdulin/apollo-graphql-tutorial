import { gql } from 'apollo-server';

const typeDefs = gql`
  directive @auth(requires: [Role]) on OBJECT | FIELD_DEFINITION

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
    bitcoinAddress: String @auth(requires: [admin])
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
    user(id: ID!): User @auth(requires: [admin, editor, viewer])
    posts(ids: [ID!]!): [Post]!

    adminUsers: [User]! @auth(requires: [admin])
    config: Config @auth(requires: [admin, editor, viewer])
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Mutation {
    createPost(input: CreatePostInput!): CommonResponse! @auth(requires: [admin])
    createUser(input: CreateUserInput!): CommonResponse! @auth(requires: [admin])
  }
`;

export { typeDefs };
