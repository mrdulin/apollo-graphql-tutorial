import { gql } from 'apollo-server';

const typeDefs = gql`
  type Post {
    postId: ID!
    postTitle: String!
    postContent: String!
    postAuthorId: ID
  }

  input PostTag {
    name: String!
  }

  input PostInput {
    postTitle: String!
    postContent: String!
    postAuthorId: ID!
    postTags: [PostTag!]!
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Query {
    posts: [Post]!
  }

  type Mutation {
    addPost(post: PostInput): CommonResponse!
  }
`;

export { typeDefs };
