import { IMiddleware } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';
import { logger } from '../../util';

const logMiddleware: IMiddleware = async (
  // tslint:disable-next-line:ban-types
  resolve: Function,
  parent: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo,
) => {
  try {
    logger.debug('Input', { context: info.fieldName, arguments: args });
    const res = await resolve(parent, args, context, info);
    logger.debug(`Output`, { context: info.fieldName, extra: res });
    return res;
  } catch (e) {
    logger.error(e);
  }
};

export { logMiddleware };
