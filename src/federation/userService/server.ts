import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { MemoryDB } from '../common';

const typeDefs = gql`
  type Query {
    userById(id: ID!): User
  }
  type User @key(fields: "id") {
    id: ID!
    name: String!
  }
`;

const resolvers: any = {
  Query: {
    userById: (_, { id }, { db }) => {
      return db.users.find((u) => u.id === +id);
    },
  },
  User: {
    __resolveReference(user, { db }) {
      console.log(`__resolveReference, user: ${user.toJSON()}`);
      return db.users.find((u) => u.id === user.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => {
    const userId = req.headers.user_id || '';
    console.log('userId: ', userId);
    return {
      db: MemoryDB,
    };
  },
  playground: true,
  introspection: true,
});
const port = 4001;
server.listen(port).then(({ url }) => console.log(`user service server is listening on ${url}graphql`));
