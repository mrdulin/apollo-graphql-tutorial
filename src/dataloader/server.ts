import { ApolloServer, ServerInfo } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { db } from './db';
import { ApolloServerBase } from 'apollo-server-core';
import { UserLoader, User } from './modules/user';

async function createApolloServer(): Promise<ApolloServerBase> {
  const PORT = process.env.PORT || 3000;
  const server = new ApolloServer({ typeDefs, resolvers, context: { db, UserLoader, User } });

  await server
    .listen(PORT)
    .then(({ url }: ServerInfo) => {
      console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => {
      console.error('Create server failed.');
      console.error(error);
    });
  return server;
}

export { createApolloServer };
