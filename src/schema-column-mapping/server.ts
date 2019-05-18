import { ApolloServer, ServerInfo } from 'apollo-server';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';

import { schema, AddressDataSourceImpl, UserDataSourceImpl, IAddressDataSource, IUserDataSource } from './modules';

const PORT = process.env.PORT || '3000';

interface IAppContext {
  dataSources: {
    address: IAddressDataSource;
    user: IUserDataSource;
  };
}

const server = new ApolloServer({
  schema,
  introspection: true,
  dataSources: (): DataSources<IAppContext> => ({
    address: new AddressDataSourceImpl(),
    user: new UserDataSourceImpl(),
  }),
  debug: false,
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
