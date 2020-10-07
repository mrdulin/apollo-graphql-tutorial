import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';

function eddyApolloPlugin(): ApolloServerPlugin {
  return {
    requestDidStart(requestContext) {
      return {
        willSendResponse(context) {
          console.log('willSendResponse');
          console.log('operationName: ', context.request.operationName);
          console.log(`${context.operation!.operation} name:`, Object.keys(context.response.data!)[0]);
        },
      };
    },
  };
}

const typeDefs = gql`
  type Query {
    hello: String
  }
  type Mutation {
    update: String
  }
`;
const resolvers = {
  Query: {
    hello() {
      return 'Hello, World!';
    },
  },
  Mutation: {
    update() {
      return 'success';
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers, plugins: [eddyApolloPlugin()] });
const port = 3000;
server.listen(port).then(({ url }) => console.log(`Server is ready at ${url}`));
