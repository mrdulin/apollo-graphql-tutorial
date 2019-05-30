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

  input PostInput {
    postTitle: String!
    postContent: String!
    postAuthorId: ID!
  }

  extend type Query {
    postById(id: ID!): Post
    posts: [Post]!
  }

  extend type Mutation {
    addPost(post: PostInput!): CommonResponse!
  }
`;

export { typeDefs };
