import { server } from './server';
import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';

const viewerMutation = gql`
  mutation {
    viewerMutation {
      createElement(input: { name: null }) {
        id
      }
    }
  }
`;

describe('57802229', () => {
  it('should pass', async () => {
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: viewerMutation });
    console.log(res);
  });
});
