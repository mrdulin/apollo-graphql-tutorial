import { IMiddleware } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';
import { logger } from '../../util';
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
  const resolveTrace = tracer.createChildSpan({ name: info.fieldName });
  const res = await resolve(parent, args, context, info);
  resolveTrace.endSpan();
  return res;
};

export { traceMiddleware };
