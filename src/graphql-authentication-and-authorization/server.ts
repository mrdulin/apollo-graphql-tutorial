import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { db } from './db';
import { schema as schemaWIthMiddleware } from './schemaWIthMiddleware';
import { schema as schemaWithClass } from './schemaWithClass';
import { schema as schemaWithCombineResolvers } from './schemaWithCombineResolvers';
import { schema as schemaWithDirective } from './schemaWithDirective';
import http from 'http';

async function createApolloServer(): Promise<http.Server> {
  const PORT = process.env.PORT || 3000;
  const app = express();

  function contextFunction({ req }) {
    const token = req.get('authorization');
    // mock jwt auth user
    const user = db.users.find((u) => u.id.toString() === token);
    req.user = user;
    return { db, req };
  }

  const server = new ApolloServer({
    // schema: schemaWIthMiddleware,
    // schema: schemaWithClass,
    // schema: schemaWithDirective,
    schema: schemaWithCombineResolvers,
    context: contextFunction,
  });
  server.applyMiddleware({ app, path: '/graphql' });

  return new Promise((resolve) => {
    const httpServer = app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      resolve(httpServer);
    });
  });
}

export { createApolloServer };
