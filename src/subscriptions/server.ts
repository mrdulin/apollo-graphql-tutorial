import { ApolloServer, ServerInfo } from 'apollo-server';
import * as http from 'http';
import WebSocket = require('ws');
import { ConnectionContext, ExecutionParams } from 'subscriptions-transport-ws';
import { Request } from 'express';
import { ContextFunction, Context } from 'apollo-server-core';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { memoryDB, IMemoryDB, UserType, IUser } from './datasources/memoryDB';
import { LocationConnector, UserConnector, TemplateConnector, IConnectors } from './connectors';
import { pubsub } from './pubsub';
import { validateToken } from './auth';

interface IServerOptions {
  PORT: string | number;
}

interface IContextFunctionParams {
  req: Request;
  connection: ExecutionParams;
}

interface IAppContext extends IConnectors<IMemoryDB> {
  requestingUser: IUser | undefined;
}

interface ISubscriptionContext extends Pick<IConnectors<IMemoryDB>, 'locationConnector' | 'userConnector'> {
  subscribeUser: IUser | undefined;
}

interface IWebSocketConnectionParams {
  token?: string;
}

const contextFunction: ContextFunction<IContextFunctionParams, IConnectors<IMemoryDB>> = (
  context: IContextFunctionParams
): Context<IAppContext> => {
  const { req, connection } = context;
  if (connection) {
    return connection.context;
  } else {
    const token: string = validateToken(req);
    const userConnector = new UserConnector<IMemoryDB>(memoryDB);
    let user: IUser | undefined;
    try {
      const userType: UserType = UserType[token];
      user = userConnector.findUserByUserType(userType);
    } catch (error) {
      throw error;
    }
    return {
      requestingUser: user,
      locationConnector: new LocationConnector<IMemoryDB>(memoryDB),
      userConnector,
      templateConnector: new TemplateConnector<IMemoryDB>(memoryDB, pubsub)
    };
  }
};

async function createServer(options: IServerOptions): Promise<http.Server | void> {
  const { PORT } = options;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextFunction,
    introspection: true,
    subscriptions: {
      onConnect: (
        connectionParams: IWebSocketConnectionParams,
        webSocket: WebSocket,
        connectionContext: ConnectionContext
      ) => {
        console.log('websocket connect');
        console.log('connectionParams: ', connectionParams);
        if (connectionParams.token) {
          const token: string = validateToken(connectionParams.token);
          const userConnector = new UserConnector<IMemoryDB>(memoryDB);
          let user: IUser | undefined;
          try {
            const userType: UserType = UserType[token];
            user = userConnector.findUserByUserType(userType);
          } catch (error) {
            throw error;
          }

          const context: ISubscriptionContext = {
            subscribeUser: user,
            userConnector,
            locationConnector: new LocationConnector<IMemoryDB>(memoryDB)
          };

          return context;
        }

        throw new Error('Missing auth token!');
      },
      onDisconnect: (webSocket: WebSocket, connectionContext: ConnectionContext) => {
        console.log('websocket disconnect');
      }
    }
  });

  return server
    .listen(PORT)
    .then(({ url, subscriptionsUrl }: ServerInfo) => {
      console.log(`🚀 Server ready at ${url}`);
      console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
    })
    .catch(error => {
      console.error('Create server failed.');
      console.error(error);
    });
}

export { createServer, IServerOptions, IAppContext, ISubscriptionContext };
