import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    userId: ID!
    userNme: String
    userEmail: String
  }

  type Post {
    postId: ID!
    postTitle: String
    postCreatedAt: String
    postAuthor: User
  }

  type Query {
    postById(id: ID!): Post
    posts: [Post]!
  }
`;

export { typeDefs };
