import { ApolloServer, ServerInfo } from 'apollo-server';
import { ContextFunction } from 'apollo-server-core';
import http from 'http';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { IUserRepsitory } from './repositories/User/UserRepsitory';
import { UserEntityData } from './models/User/UserEntity';

interface IAppContext {
  userRepositoryImpl: IUserRepsitory<UserEntityData>;
}

interface IServerOptions {
  PORT: string | number;
  contextFunction: ContextFunction;
}

async function createServer(options: IServerOptions): Promise<http.Server | void> {
  const { PORT, contextFunction } = options;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextFunction,
  });

  return server
    .listen(PORT)
    .then(({ url }: ServerInfo) => {
      console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => {
      console.error('Create server failed.');
      console.error(error);
    });
}

export { createServer, IServerOptions, IAppContext };
