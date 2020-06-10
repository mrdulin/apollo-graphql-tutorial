import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { MemoryDB } from '../common';

const typeDefs = gql`
  type Query {
    productById(upc: ID!): Product
  }
  type Product @key(fields: "upc") {
    upc: ID!
    name: String!
    price: Int
  }
`;

const resolvers: any = {
  Query: {
    productById: (_, { upc }, { db }) => {
      return db.products.find((p) => p.upc === +upc);
    },
  },
  Product: {
    __resolveReference(product, { db }) {
      console.log(`__resolveReference, product: ${JSON.stringify(product)}`);
      return db.products.find((p) => p.upc === +product.upc);
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
const port = 4002;
server.listen(port).then(({ url }) => console.log(`product service server is listening on ${url}graphql`));
