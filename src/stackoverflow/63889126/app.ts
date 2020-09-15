import { ApolloServer } from 'apollo-server';
import schema from './typedefs';
import resolvers from './resolvers';
import { mergeSchemas } from 'graphql-tools';

const mergedSchema = mergeSchemas({
  schemas: schema,
});

const server = new ApolloServer({ schema: mergedSchema, resolvers });
const port = 3000;
server.listen(port).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
