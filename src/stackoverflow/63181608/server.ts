import { ApolloServer, gql } from 'apollo-server';
import MyDatasource from './datasource';

const typeDefs = gql`
  type Query {
    dummy: String
  }
  type Mutation {
    upload: String
  }
`;
const resolvers = {
  Mutation: {
    upload(_, __, { dataSources }) {
      return dataSources.uploadAPI.postFileToServer({ str: '1234' });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      uploadAPI: new MyDatasource(),
    };
  },
});
const port = 3001;
server.listen(port).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
