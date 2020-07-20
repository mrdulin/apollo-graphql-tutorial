import { ApolloServer, gql, PubSub } from 'apollo-server';
import { Request } from 'express';

const MemoryDB: any = {
  posts: [],
};
const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED';
const typeDefs = gql`
  type Subscription {
    postAdded: Post
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Post {
    author: String
    comment: String
  }
`;
const resolvers = {
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
  Query: {
    posts(root, args, context) {
      return MemoryDB.posts;
    },
  },
  Mutation: {
    addPost(root, args, context) {
      pubsub.publish(POST_ADDED, { postAdded: args });
      MemoryDB.posts.push(args);
      return args;
    },
  },
};

async function authenticate(token: string) {
  return !!token;
}
async function authenticateFromHeader(req: Request) {
  return req.header('authorization') ? {} : null;
}
interface IConnectionParams {
  authToken: string;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      if ((connectionParams as IConnectionParams).authToken) {
        try {
          const user = await authenticate((connectionParams as IConnectionParams).authToken);
          if (user) {
            return { user, webSocket };
          }
        } catch (error) {
          return {};
        }
      }
      return {};
    },
  },
  context: async ({ req, res, connection }) => {
    if (connection) {
      return connection.context;
    }
    let user;
    try {
      user = await authenticateFromHeader(req);
    } catch (error) {
      console.log(error);
    }
    return { req, res, user };
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
