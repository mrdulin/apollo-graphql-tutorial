import { IMiddleware } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from 'apollo-server';

const resolverAuthMap = {
  Query: {
    user: 'viewer:editor:admin',
    adminUsers: 'admin',
    config: 'viewer:editor:admin',
  },
  Mutation: {
    createPost: 'admin',
    createUser: 'admin',
  },
  User: {
    bitcoinAddress: 'admin',
  },
};

const authMiddleware: IMiddleware = async (
  // tslint:disable-next-line: ban-types
  resolve: Function,
  parent: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo,
) => {
  if (resolverAuthMap[info.parentType.name]) {
    const role = resolverAuthMap[info.parentType.name][info.fieldName];
    if (role) {
      const roles = role.split(':');
      const { user } = context.req;
      console.log(
        `[authMiddleware] parentType.name: ${info.parentType.name}, fieldName: ${
          info.fieldName
        }, role = ${role}, user = ${JSON.stringify(user)}`,
      );
      if (!user || !roles.includes(user.role)) {
        throw new AuthenticationError('no permission');
      }
    }
  }
  return resolve(parent, args, context, info);
};

export { authMiddleware };
