import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typeDefs';
// import { typeDefs } from './typeDefsWithDirective';
import { makeExecutableSchema } from 'graphql-tools';
import { authMiddleware } from './middleware';
import { AuthDirective } from './directive';

import { resolvers } from './resolvers';
import { resolversWIthAuthEnhancer } from './resolversWIthAuthEnhancer';
import { resolversWithClass } from './resolversWithClass';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolversWIthAuthEnhancer,
  // schemaDirectives: {
  //   auth: AuthDirective,
  //   authorized: AuthDirective,
  //   authenticated: AuthDirective,
  // },
});

export { schema };

// const schemaWithMiddleware = applyMiddleware(schema, authMiddleware);
// export { schemaWithMiddleware as schema };
