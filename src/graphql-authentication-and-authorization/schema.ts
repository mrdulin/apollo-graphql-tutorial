import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typeDefsWithDirective';
import { resolvers } from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { authMiddleware } from './middleware';
import { AuthDirective } from './directive';
import { resolversWIthAuthEnhancer } from './resolversWIthAuthEnhancer';
import { resolversWithClass } from './resolversWithClass';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolversWithClass,
  // schemaDirectives: {
  //   auth: AuthDirective,
  //   authorized: AuthDirective,
  //   authenticated: AuthDirective,
  // },
});
const schemaWithMiddleware = applyMiddleware(
  schema,
  // authMiddleware
);

export { schemaWithMiddleware as schema };
