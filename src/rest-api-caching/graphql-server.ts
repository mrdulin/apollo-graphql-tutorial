import { ApolloServer, gql } from 'apollo-server-express';
import { RESTDataSource } from 'apollo-datasource-rest';
import express from 'express';

class MyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000/api/';
  }
  public async getUser() {
    return this.get('user');
  }
}

const typeDefs = gql`
  type User {
    name: String
    email: String
  }
  type Query {
    user: User
  }
`;

const resolvers = {
  Query: {
    user: async (_, __, { dataSources: ds }: IAppContext) => {
      return ds.myAPI.getUser();
    },
  },
};

const dataSources = () => ({
  myAPI: new MyAPI(),
});

interface IAppContext {
  dataSources: ReturnType<typeof dataSources>;
}

const app = express();
const port = 3001;
const graphqlPath = '/graphql';
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
});

server.applyMiddleware({ app, path: graphqlPath });

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Apollo server is listening on http://localhost:${port}${graphqlPath}`);
  });
}
