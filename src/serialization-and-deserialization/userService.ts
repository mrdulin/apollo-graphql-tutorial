import { ApolloServer, gql } from 'apollo-server';
import faker from 'faker';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
  }

  type Query {
    users: [User]!
  }
`;

const users: any[] = [];
for (let i = 0; i < 1000; i++) {
  users.push({
    id: faker.random.uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  });
}

const MemoryDb = {
  users,
};

const resolvers = {
  Query: {
    users(_, __, { db }) {
      return db.users;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    db: MemoryDb,
  },
});
const port = 3000;

server.listen(port).then(({ url }) => console.log(`user service is listening on ${url}`));
