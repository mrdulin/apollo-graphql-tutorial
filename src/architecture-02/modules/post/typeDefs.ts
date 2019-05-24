import { gql } from 'apollo-server';

const typeDefs = gql`
  type Post {
    postId: ID!
    postTitle: String!
    postContent: String!
    postCreatedAt: String!
    postAuthorId: ID!
    postAuthor: User
  }

  extend type Query {
    postById(id: ID!): Post
    posts: [Post]!
  }
`;

export { typeDefs };
