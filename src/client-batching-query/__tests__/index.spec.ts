import faker from 'faker';
import { createTestClient } from 'apollo-server-testing';
import { createApolloServer } from '../server';
import { gql } from 'apollo-server';
import { logger } from '../../util';

let server;
let testClient;
beforeAll(async () => {
  server = await createApolloServer();
  testClient = createTestClient(server);
});

afterAll(async () => {
  await server.stop();
});

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
      const post = { postTitle: faker.lorem.sentence(), postContent: faker.lorem.paragraphs(), postAuthorId: 1 };
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

      const post1 = { postTitle: faker.lorem.sentence(), postContent: faker.lorem.paragraphs(), postAuthorId: 1 };
      const post2 = { postTitle: faker.lorem.sentence(), postContent: faker.lorem.paragraphs(), postAuthorId: 2 };
      const actualValue = await testClient.mutate({ mutation: ADD_POSTS, variables: { post1, post2 } });
      expect(actualValue).toMatchSnapshot();
    });
  });
});
