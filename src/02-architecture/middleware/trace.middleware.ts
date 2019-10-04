import { IMiddleware } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';
// tslint:disable-next-line:no-var-requires
const { tracer } = require('../traceAgent');

const traceMiddleware: IMiddleware = async (
  // tslint:disable-next-line:ban-types
  resolve: Function,
  parent: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo,
) => {
  const graphqlOperations = ['Query', 'Mutation', 'Subscrpition'];
  if (graphqlOperations.includes(info.parentType.name)) {
    const resolveTrace = tracer.createChildSpan({ name: info.fieldName });
    resolveTrace.addLabel('operation', info.operation.operation);
    resolveTrace.addLabel('args', JSON.stringify(args));
    const res = await resolve(parent, args, context, info);
    resolveTrace.endSpan();
    return res;
  } else {
    const res = await resolve(parent, args, context, info);
    return res;
  }
};

export { traceMiddleware };
