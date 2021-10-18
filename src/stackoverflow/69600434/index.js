const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');

// Minimal example middleware (before & after)
const beepMiddleware = {
  Query: {
    hello: async (resolve, parent, args, context, info) => {
      // You can use middleware to override arguments
      const argsWithDefault = { name: 'Bob', ...args };
      const result = await resolve(parent, argsWithDefault, context, info);
      // Or change the returned values of resolvers
      return result.replace(/Trump/g, 'beep');
    },
    tours: async (resolve, parent, args, context, info) => {
      const result = await resolve(parent, args, context, info);
      return result.concat([4]);
    },
  },
};

const typeDefs = `
  type Query {
    hello(name: String): String
    tours: [Int]!
  }
`;
const resolvers = {
  Query: {
    hello: (parent, { name }, context) => `Hello ${name ? name : 'world'}!`,
    tours: () => [1, 2, 3],
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const schemaWithMiddleware = applyMiddleware(schema, beepMiddleware);

const server = new ApolloServer({
  schema: schemaWithMiddleware,
});

server.listen({ port: 8008 }).then(() => console.log('Server started at http://localhost:8008'));
