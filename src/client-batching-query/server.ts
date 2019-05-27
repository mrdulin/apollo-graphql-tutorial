import { ApolloServer, ServerInfo } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolver';
import { memoryDB } from './db/memoryDB';
import { ApolloServerBase } from 'apollo-server-core';

async function createApolloServer(): Promise<ApolloServerBase> {
  const PORT = process.env.PORT || 3000;
  const server = new ApolloServer({ typeDefs, resolvers, context: { db: memoryDB } });

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
