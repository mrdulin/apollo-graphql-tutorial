import {
  ApolloServer,
  introspectSchema,
  makeRemoteExecutableSchema,
  gql,
  mergeSchemas,
  makeExecutableSchema,
} from 'apollo-server';
import fetch from 'cross-fetch';
import { HttpLink } from 'apollo-link-http';
import { GraphQLSchema, GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { cloneDeep } from 'lodash';

async function getRemoteSchema(uri: string) {
  const link = new HttpLink({ uri, fetch });
  const schema = await introspectSchema(link);
  const executableSchema = makeRemoteExecutableSchema({ schema, link });
  return executableSchema;
}

function getServiceASchema() {
  return getRemoteSchema('http://localhost:3001/graphql');
}
function getServiceBSchema() {
  return getRemoteSchema('http://localhost:3002/graphql');
}

const typeDefs = gql`
  type Query {
    gw: String
  }
`;
const resolvers = {
  Query: {
    gw: () => 'gateway',
  },
};

(async function bootstrap() {
  const port = 3000;
  let remoteSchemas: GraphQLSchema[];
  try {
    // order is matter. Last User Object Type will be merged into schema
    // https://stackoverflow.com/questions/62874730/how-to-use-mergeschemas-for-remote-schemas-with-apollo-server
    remoteSchemas = await Promise.all([getServiceBSchema(), getServiceASchema()]);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  const gatewaySchema = makeExecutableSchema({ typeDefs, resolvers });
  const schema = mergeSchemas({ schemas: [gatewaySchema, ...remoteSchemas] });
  const server = new ApolloServer({ schema });
  server.listen(port).then(({ url }) => console.log(`Gateway is ready at ${url}`));
})();
