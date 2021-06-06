import express from 'express';
import { ApolloServer, gql, MergeInfo } from 'apollo-server-express';
import { GraphQLResolveInfo } from 'graphql';

const app = express();

const typeDefs = gql`
  type User {
    email: String!
  }
  type Query {
    user: User
  }
  type Mutation {
    createUser(email: String!, password: String!): Boolean
  }
`;

export declare type IFieldResolver<TSource, TContext, TArgs = Record<string, any>> = (
  source: TSource,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo;
  },
) => any;

type CreateUserArgs = {
  email: string;
  password: string;
};

interface AppContext {
  userService: UserService;
}

const resolvers = {
  Query: {},
  Mutation: {
    createUser: (
      parent: undefined,
      args: CreateUserArgs,
      context: AppContext,
      info: GraphQLResolveInfo & { mergeInfo: MergeInfo },
    ) => {
      console.log(parent);
      return context.userService.createUser(args.email, args.password);
    },
  },
};

interface UserService {
  createUser(email: string, password: string): boolean;
}
class UserServiceImpl {
  public createUser(email: string, password: string) {
    return true;
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    userService: new UserServiceImpl(),
  },
});
server.applyMiddleware({ app, path: '/graphql' });
app.listen(8080, () => console.log('Apollo server started at http://localhost:8080'));
