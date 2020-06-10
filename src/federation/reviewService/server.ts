import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { MemoryDB } from '../common';

const typeDefs = gql`
  type Query {
    reviewById(id: ID!): Review
  }
  type Review {
    id: ID!
    product: Product
  }
  extend type Product @key(fields: "upc") {
    upc: ID! @external
    reviews: [Review]!
  }
`;

const resolvers: any = {
  Query: {
    reviewById: (_, { id }, { db }) => {
      return db.reviews.find((r) => r.id === +id);
    },
  },
  Review: {
    product(review) {
      console.log('resolve Review.product, review:', review);
      return { __typename: 'Product', upc: review.product_upc };
    },
  },
  Product: {
    reviews(product, _, { db }) {
      console.log('resolve Product.reviews, product: ', product, 'db: ', db);
      return db.reviews.filter((r) => r.product_upc === +product.upc) || [];
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
const port = 4003;
server.listen(port).then(({ url }) => console.log(`review service server is listening on ${url}graphql`));
