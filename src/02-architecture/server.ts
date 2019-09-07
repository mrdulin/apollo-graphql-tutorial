import { ApolloServer } from 'apollo-server-express';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import express from 'express';
import http from 'http';

import {
  schemaWithMiddleware,
  AddressDataSourceImpl,
  UserDataSourceImpl,
  IAddressDataSource,
  IUserDataSource,
} from './schema';
import { ContextFunction } from 'apollo-server-core';
import { credentials } from './credentials';
import { IPostDataSource, PostDataSourceImpl } from './modules/post';
import { logger } from '../util';

interface IAppContext {
  dataSources: {
    address: IAddressDataSource;
    user: IUserDataSource;
    post: IPostDataSource;
  };
}

interface IServerOptions {
  PORT: string | number;
  GRAPHQL_ENDPOINT: string;
}

async function createServer(options: IServerOptions): Promise<http.Server> {
  const { PORT, GRAPHQL_ENDPOINT } = options;
  const app = express();
  const httpServer = http.createServer(app);

  const contextFunction: ContextFunction = ({ req }) => {
    return {
      request: req,
    };
  };

  const apolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
    introspection: true,
    dataSources: (): DataSources<IAppContext> => ({
      address: new AddressDataSourceImpl(),
      user: new UserDataSourceImpl(),
      post: new PostDataSourceImpl(),
    }),
    context: contextFunction,
    // engine: {
    //   apiKey: credentials.APOLLO_ENGINE_API_KEY,
    // },
    tracing: false,
  });

  apolloServer.applyMiddleware({ app, path: GRAPHQL_ENDPOINT });

  return new Promise((resolve, reject) => {
    httpServer
      .listen(PORT)
      .on('listening', () => {
        logger.info(`🚀 Http Server ready at http://localhost:${PORT}`);
        logger.info(`🚀 GraphQL Server ready at http://localhost:${PORT}${GRAPHQL_ENDPOINT}`);
        resolve(httpServer);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export { IAppContext, createServer };
