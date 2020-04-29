import { ApolloServer, gql, ServerInfo } from 'apollo-server';

const MemoryDB = {
  books: [
    { id: 1, userId: 1 },
    { id: 2, userId: 1 },
    { id: 3, userId: 1 },
    { id: 4, userId: 1 },
    { id: 5, userId: 1 },
  ],
};

const typeDefs = gql`
  type Booking {
    id: ID!
  }

  type Query {
    bookingsByUser(userId: ID!, limit: Int): [Booking]
  }
`;

const resolvers = {
  Query: {
    bookingsByUser: async (_, { userId, limit }, { db }) => {
      console.log('[user service] Query.bookingsByUser, args:', { userId, limit });
      return db.books.filter((book) => book.userId === Number.parseInt(userId, 10)).slice(0, limit);
    },
  },
};

const PORT = 3000;
const server = new ApolloServer({ typeDefs, resolvers, context: { db: MemoryDB } });

server
  .listen(PORT)
  .then(({ url }: ServerInfo) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error('Create server failed.');
    console.error(error);
  });
