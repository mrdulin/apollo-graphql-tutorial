import { ApolloServer } from 'apollo-server';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  public willSendRequest({ request, context }) {
    request.http.headers.set('user_id', context.userId);
  }
}

function getUserId(token: string): number {
  return token ? 1 : -1;
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'user', url: 'http://localhost:4001' },
    { name: 'product', url: 'http://localhost:4002' },
    { name: 'review', url: 'http://localhost:4003' },
  ],
  serviceHealthCheck: true,
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    console.log('token:', token);
    const userId = getUserId(token);
    return { userId };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
