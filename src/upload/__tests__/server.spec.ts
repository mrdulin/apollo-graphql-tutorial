import { createTestClient } from 'apollo-server-testing';
import { createApolloServer } from '../server';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { logger } from '../../util';

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
  it('should upload file correctly', async () => {
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

    const filename = '15625760447371547012340909WX20190108-124331.png';
    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', fs.createReadStream(path.resolve(__dirname, `./files/${filename}`)));
    const json = await fetch('http://localhost:4000', { method: 'POST', body }).then((response) => response.json());
    // logger.debug('upload testing#1', { arguments: { json } });
    expect(json).toEqual(
      expect.objectContaining({
        data: {
          singleUpload: {
            code: expect.any(Number),
            message: expect.any(String),
          },
        },
      }),
    );
  });

  it.skip('should get file size limit error', async () => {
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

    const filename = 'graphql-n-plus-1-query.png';
    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', fs.createReadStream(path.resolve(__dirname, `./files/${filename}`)));
    const json = await fetch('http://localhost:4000', { method: 'POST', body }).then((response) => response.json());
    // logger.debug('upload testing#1', { arguments: { json } });
    expect(json.data).toBeNull();
    expect(json.errors[0].message).toBe('File truncated as it exceeds the size limit.');
  });
});
