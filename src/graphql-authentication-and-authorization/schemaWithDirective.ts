import { AuthDirective } from './directive';
import { typeDefs } from './typeDefsWithDirective';
import { resolvers } from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective,
    authorized: AuthDirective,
    authenticated: AuthDirective,
  },
});

export { schema };
