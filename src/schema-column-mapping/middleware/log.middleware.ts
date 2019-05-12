import { IMiddleware } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';

const logMiddleware: IMiddleware = async (
  // tslint:disable-next-line:ban-types
  resolve: Function,
  parent: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo,
) => {
  try {
    console.log(`[debug]: context: ${info.fieldName}. Input: ${JSON.stringify(args)}`);
    const res = await resolve(parent, args, context, info);
    console.log(`[debug]: context: ${info.fieldName}. Output: ${JSON.stringify(res)}`);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export { logMiddleware };
