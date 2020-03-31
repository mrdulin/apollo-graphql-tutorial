import http from 'http';
import { ApolloServer, gql, PubSub } from 'apollo-server-express';
import express from 'express';

const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED';
const db: { posts: any[] } = {
  posts: [],
};

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
      return db.posts;
    },
  },
  Mutation: {
    addPost(root, args, context) {
      pubsub.publish(POST_ADDED, { postAdded: args });
      const post = { ...args };
      db.posts.push(post);
    },
  },
};

const PORT = 4000;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log('remote address: ', context.request.connection.remoteAddress);
      console.log('websocket connected');
    },
    onDisconnect: (webSocket, context) => {
      console.log('websocket disconnected');
    },
  },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
