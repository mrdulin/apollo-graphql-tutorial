import { onError } from '@apollo/client/link/error';

type ErrorResponse = any;

export const errorLink = onError(({ response, graphQLErrors, networkError, operation }: ErrorResponse) => {
  console.log('An Error Occurred');
  console.log('graphQLErrors: ', graphQLErrors);
});
