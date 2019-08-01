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

  input PostInput {
    postTitle: String!
    postContent: String!
    postTags: [TagInput]
    postAuthorId: ID!
  }

  input TagInput {
    tagNme: String!
  }

  type Tag {
    tagId: ID!
    tagNme: String!
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Query {
    user(id: ID!): User

    post(id: ID!): Post
    posts: [Post]!
  }

  type Mutation {
    post(postInput: PostInput!): CommonResponse
  }
`;

export { typeDefs };
