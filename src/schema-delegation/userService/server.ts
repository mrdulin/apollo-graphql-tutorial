import {
  ApolloServer,
  gql,
  ServerInfo,
  introspectSchema,
  makeRemoteExecutableSchema,
  makeExecutableSchema,
  delegateToSchema,
} from 'apollo-server';
import faker from 'faker';
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';

const MemoryDB = {
  users: [
    { id: 1, name: faker.name.findName() },
    { id: 2, name: faker.name.findName() },
  ],
};

const typeDefs = gql`
  type User {
    id: ID!
    bookings(limit: Int): [Booking]
  }

  type Booking {
    id: ID!
  }

  type Query {
    userById(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    userById: async (_, { id }, { db }) => {
      return db.users.find((u) => u.id === Number.parseInt(id, 10));
    },
  },
  User: {
    bookings: async (user, { limit }, context, info) => {
      const { bookServiceSchema } = context;
      return delegateToSchema({
        schema: bookServiceSchema,
        operation: 'query',
        fieldName: 'bookingsByUser',
        args: { limit, userId: user.id },
        context,
        info,
      });
    },
  },
};

async function getBookServiceSchema() {
  const bookServiceEndpoint = 'http://localhost:3000/graphql';
  const link = new HttpLink({ uri: bookServiceEndpoint, fetch });
  const schema = await introspectSchema(link);
  const executableSchema = makeRemoteExecutableSchema({ schema, link });
  return executableSchema;
}

(async function createApolloServer() {
  const PORT = 3001;
  const bookServiceSchema = await getBookServiceSchema();
  const userServiceSchema = makeExecutableSchema({ typeDefs, resolvers });
  // If pass merged schemas to apollo server, the Query.bookingsByUser of book service will be exposed.
  // For this example, we just want to expose user service GraphQL APIs, and delegate User.bookings resolver to book service Query.bookingsByUser resolver.
  // const schema = mergeSchemas({ schemas: [bookServiceSchema, userServiceSchema] });

  const server = new ApolloServer({ schema: userServiceSchema, context: { db: MemoryDB, bookServiceSchema } });

  server
    .listen(PORT)
    .then(({ url }: ServerInfo) => {
      console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => {
      console.error('Create server failed.');
      console.error(error);
    });
})();
