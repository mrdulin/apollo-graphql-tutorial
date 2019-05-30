import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { ApolloServerBase } from 'apollo-server-core';

async function createApolloServer(): Promise<ApolloServerBase> {
  const server = new ApolloServer({
    uploads: true,
    typeDefs,
    resolvers,
  });

  try {
    const { url } = await server.listen();
    console.log(`🚀 Server ready at ${url}`);
    return server;
  } catch (error) {
    throw error;
  }
}

export { createApolloServer };
