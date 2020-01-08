import { ApolloServer, gql } from 'apollo-server';
import { GraphQLResponse, GraphQLRequestContext } from 'apollo-server-express/node_modules/apollo-server-core';

const typeDefs = gql`
  type Query {
    _root: String
  }
`;
const resolvers = {
  Query: {
    _root: () => '_root',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatResponse: (response: GraphQLResponse | null, requestContext: GraphQLRequestContext<any>) => {
    if (requestContext.response && requestContext.response.http) {
      requestContext.response.http.headers.set('custom-key', 'custom-value');
    }
    return response as GraphQLResponse;
  },
});

server.listen().then(({ url }) => {
  console.log(`Apollo server is listening on ${url}`);
});
