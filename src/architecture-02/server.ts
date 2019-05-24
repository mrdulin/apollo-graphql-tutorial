import { ApolloServer, ServerInfo } from 'apollo-server';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';

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

const PORT = process.env.PORT || '3000';

interface IAppContext {
  dataSources: {
    address: IAddressDataSource;
    user: IUserDataSource;
    post: IPostDataSource;
  };
}

const contextFunction: ContextFunction = ({ req }) => {
  return {
    request: req,
  };
};

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  introspection: true,
  dataSources: (): DataSources<IAppContext> => ({
    address: new AddressDataSourceImpl(),
    user: new UserDataSourceImpl(),
    post: new PostDataSourceImpl(),
  }),
  context: contextFunction,
  engine: {
    apiKey: credentials.APOLLO_ENGINE_API_KEY,
  },
});

server
  .listen(PORT)
  .then(({ url }: ServerInfo) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error('Create server failed.');
    console.error(error);
  });

export { IAppContext };
