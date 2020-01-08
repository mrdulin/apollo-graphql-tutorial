import { makeExecutableSchema } from 'apollo-server';
import { ApolloServer, gql } from 'apollo-server-hapi';
import Hapi from 'hapi';
import { graphqlHapi } from './hapiApollo';

const typeDefs = gql`
  type Query {
    _: String
  }
`;
const resolvers = {
  Query: {
    _: () => {
      throw new Error('some error');
    },
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });
const port = 3000;
async function StartServer() {
  const app = new Hapi.Server({ port });
  graphqlHapi.register(app, { path: '/graphql', graphqlOptions: { schema } });
  app.ext('onPreResponse', (request: any, h: any) => {
    const response = request.response;
    if (!response.isBoom) {
      return h.continue;
    }
    return h.response({ message: response.message }).code(400);
  });

  await app.start();
}

StartServer()
  .then(() => {
    console.log(`apollo server is listening on http://localhost:${port}/graphql`);
  })
  .catch((error) => console.log(error));
