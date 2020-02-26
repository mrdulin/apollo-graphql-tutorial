import { ApolloServer, gql } from 'apollo-server-express';
import { RESTDataSource } from 'apollo-datasource-rest';
import express from 'express';
import { RedisCache } from 'apollo-server-cache-redis';
import { Request } from 'apollo-server-env';

class MyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000/api/';
  }
  public async getUser() {
    return this.get('user');
  }
  public async getProject() {
    return this.get('project');
  }
  protected cacheKeyFor(request: Request) {
    return request.url;
  }
}

const typeDefs = gql`
  type User {
    name: String
    email: String
  }
  type Project {
    name: String
  }
  type Query {
    user: User
    project: Project
  }
`;

const resolvers = {
  Query: {
    user: async (_, __, { dataSources: ds }: IAppContext) => {
      return ds.myAPI.getUser();
    },
    project: async (_, __, { dataSources: ds }: IAppContext) => {
      return ds.myAPI.getProject();
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
  cache: new RedisCache({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    db: 0,
  }),
});

server.applyMiddleware({ app, path: graphqlPath });

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Apollo server is listening on http://localhost:${port}${graphqlPath}`);
  });
}
