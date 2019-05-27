import { gql } from 'apollo-server';

const typeDefs = gql`
  type Post {
    postId: ID!
    postTitle: String!
    postContent: String!
    postAuthorId: ID
    postAuthor: User
  }

  input PostInput {
    postTitle: String!
    postContent: String!
    postAuthorId: ID!
  }

  type User {
    userId: ID!
    userNme: String!
    userEmail: String!
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Query {
    posts: [Post]!
    userById(id: ID!): User
  }

  type Mutation {
    addPost(post: PostInput): CommonResponse!
  }
`;

export { typeDefs };
