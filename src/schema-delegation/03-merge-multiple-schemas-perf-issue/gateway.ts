import { ApolloServer } from 'apollo-server';
import { getSchema } from './schema';
import { GraphQLSchema } from 'graphql';

async function createApolloServer() {
  let schema: GraphQLSchema;
  try {
    schema = await getSchema();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  const server = new ApolloServer({ schema });
  const port = 3000;
  return server
    .listen(port)
    .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
    .catch((err) => console.log('start server error', err));
}

if (require.main === module) {
  createApolloServer();
}
