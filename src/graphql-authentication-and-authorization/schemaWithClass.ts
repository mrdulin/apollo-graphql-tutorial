import { makeExecutableSchema } from 'graphql-tools';

import { resolversWithClass } from './resolversWithClass';
import { typeDefs } from './typeDefs';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolversWithClass,
});

export { schema };
