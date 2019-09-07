import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from '../resolver';
import { typeDefs } from '../typeDefs';
import { db } from './mockedDB';

const server = new ApolloServer({ typeDefs, resolvers, context: { db } });
const testClient = createTestClient(server);

describe('client batching query', () => {
  describe('query', () => {
    it('#userById', async () => {
      const USER_BY_ID = gql`
        query userById($id: ID!) {
          userById(id: $id) {
            userNme
            userEmail
          }
        }
      `;
      const actualValue = await testClient.query({ query: USER_BY_ID, variables: { id: 1 } });
      expect(actualValue).toMatchSnapshot();
    });
  });

  describe('mutation', () => {
    it('#addPost', async () => {
      const ADD_POST = gql`
        mutation addPost($post: PostInput!) {
          addPost(post: $post) {
            code
            message
          }
        }
      `;
      const post = { postTitle: 'stackoverflow', postContent: 'stackoverflow content', postAuthorId: 1 };
      const actualValue = await testClient.mutate({ mutation: ADD_POST, variables: { post } });
      expect(actualValue).toMatchSnapshot();
    });

    it('#addPost - multiple mutations', async () => {
      const ADD_POSTS = gql`
        mutation addPost($post1: PostInput!, $post2: PostInput!) {
          addPost1: addPost(post: $post1) {
            code
            message
          }
          addPost2: addPost(post: $post2) {
            code
            message
          }
        }
      `;

      const post1 = { postTitle: 'stackoverflow', postContent: 'stackoverflow content', postAuthorId: 1 };
      const post2 = { postTitle: 'stackoverflow', postContent: 'stackoverflow content', postAuthorId: 2 };
      const actualValue = await testClient.mutate({ mutation: ADD_POSTS, variables: { post1, post2 } });
      expect(actualValue).toMatchSnapshot();
    });
  });
});
