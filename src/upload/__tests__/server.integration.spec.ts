import { createTestClient } from 'apollo-server-testing';
import { createApolloServer } from '../server';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { ApolloServerBase } from 'apollo-server-core';

// https://github.com/jaydenseric/graphql-multipart-request-spec
// https://github.com/jaydenseric/graphql-upload/blob/master/src/test.mjs

let server: ApolloServerBase;
let testClient;
beforeAll(async () => {
  server = await createApolloServer();
  testClient = createTestClient(server);
});

afterAll(async () => {
  await server.stop();
});

async function upload(body) {
  return fetch('http://localhost:4000', { method: 'POST', body }).then((response) => response.json());
}

describe('upload', () => {
  it('should upload file correctly with test server', async () => {
    const body = new FormData();
    body.append(
      'operations',
      JSON.stringify({
        query: `
          mutation ($file: Upload!) {
            singleUpload(file: $file) {
              code
              message
            }
          }
        `,
        variables: {
          file: null,
        },
      }),
    );

    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', 'a', { filename: 'a.txt' });
    const json = await upload(body);
    expect(json).toMatchSnapshot();
  });

  it('should get file size limit error', async () => {
    const body = new FormData();
    body.append(
      'operations',
      JSON.stringify({
        query: `
          mutation ($file: Upload!) {
            singleUpload(file: $file) {
              code
              message
            }
          }
        `,
        variables: {
          file: null,
        },
      }),
    );

    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', 'b'.repeat(70000), { filename: 'b.txt' });
    const json = await upload(body);
    expect(json).toMatchSnapshot();
  });
});
