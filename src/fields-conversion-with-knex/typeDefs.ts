import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    userId: ID!
    userNme: String
    userEmail: String!
  }

  type Post {
    postId: ID!
    postTitle: String!
    postContent: String!
    postCreatedAt: String
    postUpdatedAt: String
    postTags: [Tag]!
    postAuthor: User
  }

  type Tag {
    tagId: ID!
    tagNme: String!
  }

  type Query {
    user(id: ID!): User

    post(id: ID!): Post
    posts: [Post]!
  }
`;

export { typeDefs };
