import express from 'express';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-express';
import { RedisCache } from 'apollo-server-cache-redis';
import faker from 'faker';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { GraphQLError } from 'graphql';

interface ISession {
  id: string | number;
  userId: string | number;
  ipAddress: string;
  userAgent: string;
}

interface IUser {
  id: string | number;
  email: string;
  password: string;
}

interface IDB {
  sessions: ISession[];
  users: IUser[];
}

const memoryDb: IDB = {
  sessions: [],
  users: [
    { id: 1, email: 'lin@gmail.com', password: '123' },
    { id: 2, email: 'du@gmail.com', password: 'abc' },
  ],
};
const jwtSecret = 'test secret';

const typeDefs = gql`
  type User @cacheControl(maxAge: 30, scope: PRIVATE) {
    id: ID
    email: String
  }
  type Query {
    user: User
  }
  type Response {
    success: Boolean
  }
  type Mutation {
    login(email: String!, password: String!): Response
  }
`;

const resolvers = {
  Query: {
    user: async (_, __, { db, req }) => {
      console.count('resolve user');
      const sessionToken = req.cookies.sId;
      if (!sessionToken) {
        throw new AuthenticationError('Unauthenticated');
      }
      let tokenDecrypted;
      try {
        tokenDecrypted = jwt.verify(sessionToken, jwtSecret);
      } catch (error) {
        console.log(error);
        throw new GraphQLError('Internal server error');
      }
      const { sId } = tokenDecrypted;
      if (!sId) {
        throw new AuthenticationError('Unauthenticated');
      }
      const session = db.sessions.find((s) => s.id === sId);
      const user = db.users.find((u) => u.id === session.userId);
      if (!user) {
        throw new AuthenticationError(`user not found`);
      }
      return user;
    },
  },
  Mutation: {
    login: async (_, { email, password }, { req, res, db }) => {
      const userAgent = req.get('user-agent');
      const ipAddress = req.get('x-forwarded-for') || req.connection.remoteAddress || req.socket.remoteAddress;
      console.log(userAgent, ipAddress);
      // query user
      const user = db.users.find((u) => u.email === email);
      if (!user) {
        throw new AuthenticationError(`user not found for email: ${email}`);
      }
      if (user.password !== password) {
        throw new AuthenticationError('password wrong');
      }
      // create session
      const session = { id: faker.random.uuid(), userId: user.id, ipAddress, userAgent };
      db.sessions.push(session);
      // create session id
      const sId = jwt.sign({ sId: session.id }, jwtSecret);
      // set cookie
      res.cookie('sId', sId, { maxAge: 60 * 1000 });
      return { success: true };
    },
  },
};

const app = express();
const port = 3001;
const graphqlPath = '/graphql';

function context({ req, res }) {
  return { req, res, db: memoryDb };
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) => {
        return requestContext.context.req.cookies.sId;
      },
    }),
  ],
  context,
  cache: new RedisCache({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    db: 0,
  }),
});

app.use(cookieParser());
server.applyMiddleware({ app, path: graphqlPath });

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Apollo server is listening on http://localhost:${port}${graphqlPath}`);
  });
}
