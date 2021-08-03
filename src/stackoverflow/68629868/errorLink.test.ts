import { ApolloLink, execute, Observable } from '@apollo/client';
import { gql } from 'apollo-server-express';
import { errorLink } from './errorLink';

const MockQuery = gql`
  query {
    foo
  }
`;

describe('68629868', () => {
  test('should pass', (done) => {
    expect.assertions(1);
    const mockLink = new ApolloLink((operation) =>
      Observable.of({
        errors: [
          {
            message: 'resolver blew up',
          },
        ],
      } as any),
    );

    const link = errorLink.concat(mockLink);
    execute(link, { query: MockQuery }).subscribe((result) => {
      expect(result.errors![0].message).toBe('resolver blew up');
      done();
    });
  });
});
