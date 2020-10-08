import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';

function customHTTPStatusPlugin(): ApolloServerPlugin {
  return {
    requestDidStart(requestContext) {
      return {
        willSendResponse({ errors, response }) {
          if (response && response.http) {
            if (errors) {
              response.data = undefined;
              response.http.status = 500;
            }
          }
        },
      };
    },
  };
}

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello() {
      throw new Error('something happened');
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers, plugins: [customHTTPStatusPlugin()] });
const port = 3000;
server.listen(port).then(({ url }) => console.log(`Server is ready at ${url}`));
