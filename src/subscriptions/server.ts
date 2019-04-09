import { ApolloServer } from 'apollo-server';
import * as http from 'http';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { memoryDB, IMemoryDB } from './datasources/memoryDB';
import { LocationConnector, UserConnector, TemplateConnector } from './connectors';

async function createServer(): Promise<http.Server | void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: req => {
      return {
        locationConnector: new LocationConnector<IMemoryDB>(memoryDB),
        userConnector: new UserConnector<IMemoryDB>(memoryDB),
        templateConnector: new TemplateConnector<IMemoryDB>(memoryDB)
      };
    }
  });

  return server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

if (require.main === module) {
  createServer();
}
