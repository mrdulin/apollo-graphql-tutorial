import { ApolloServer, gql } from 'apollo-server';

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
  }
`;

const server = new ApolloServer({
  typeDefs,
  mocks: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
