import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'apollo-server-express';

const users = [
  { id: 1, email: 'a@a.a', password: 'zaq1@WSX', pons: [{ value: 'test' }] },
  { id: 2, email: 'b@b.b', password: 'ZAQ!2wsx', pons: [{ value: 'tset' }] },
];
const pons = [{ value: 'test' }];

const typeDefs = gql`
  type Pon {
    value: String!
  }
  type User {
    id: Int
    email: String!
    password: String!
    pons: [Pon]!
  }
  type Query {
    findUser(id: Int): User
    users: [User]
    pons: [Pon]
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    pons: () => pons,
    findUser: (_, { id }) => users.find((u) => u.id === id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
