import { ApolloServer, ServerInfo } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { knex } from './db/knex';
import { logger } from './utils';
import { PostLoader, UserLoader } from './modules';

function createApolloServer(): Promise<ApolloServer> {
  const PORT = process.env.PORT || 3000;

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: { knex, PostLoader, UserLoader },
    engine: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY,
      schemaTag: process.env.ENGINE_SCHEMA_TAG,
    },
  });

  return new Promise((resolve, reject) => {
    apolloServer
      .listen(PORT)
      .then(({ url }: ServerInfo) => {
        logger.info(`🚀 Server ready at ${url}`);
        resolve(apolloServer);
      })
      .catch((error) => {
        console.error(error);
        reject('Create server failed.');
      });
  });
}

export { createApolloServer };
