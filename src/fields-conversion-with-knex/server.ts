import { ApolloServer, ServerInfo } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { knex } from './db/knex';
import { logger } from './utils';

function createApolloServer(): Promise<ApolloServer> {
  const PORT = process.env.PORT || 3000;
  const apolloServer = new ApolloServer({ typeDefs, resolvers, context: { knex } });

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
