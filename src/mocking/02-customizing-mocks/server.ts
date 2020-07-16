import { ApolloServer, gql, MockList } from 'apollo-server';
import faker from 'faker';

const typeDefs = gql`
  type User {
    id: ID!
    name: String
    age: Int
    email: String
    addresses: [Address]!
  }

  type Address {
    city: String
    country: String
    state: String
  }

  type Query {
    userById(id: ID!): User
    users: [User]
  }
`;

const mocks = {
  User: () => ({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number(100),
    email: faker.internet.email(),
  }),
  Address: () => ({
    city: faker.address.city(),
    country: faker.address.country(),
    state: faker.address.state(),
  }),
  Query: () => ({
    users: () => new MockList([2, 6]),
  }),
};

const server = new ApolloServer({
  typeDefs,
  mocks,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
