import { gql } from 'apollo-server';

export const createPost = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
      code
      message
    }
  }
`;

export const createUser = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      code
      message
    }
  }
`;
