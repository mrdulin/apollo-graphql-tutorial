import { createTestClient } from 'apollo-server-testing';
import { createApolloServer } from '../server';

// https://github.com/jaydenseric/graphql-multipart-request-spec
// https://github.com/jaydenseric/graphql-upload/blob/master/src/test.mjs

let server;
let testClient;
beforeAll(async () => {
  server = await createApolloServer();
  testClient = createTestClient(server);
});

afterAll(async () => {
  await server.stop();
});

describe('upload', () => {
  it('#1', () => {
    //
  });
});
