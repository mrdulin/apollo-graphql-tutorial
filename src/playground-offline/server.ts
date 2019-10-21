import { gql, IResolvers } from 'apollo-server';
import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    name: String
  }
`;

const resolvers: IResolvers = {
  Query: {
    name: () => 'name',
  },
};

const PORT = process.env.PORT || 3000;
const app = express();
const staticRoot = path.resolve(__dirname, '../../node_modules');
app.use('/node_modules', express.static(staticRoot));
const server = new ApolloServer({ typeDefs, resolvers, playground: { cdnUrl: './node_modules' } });
server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
