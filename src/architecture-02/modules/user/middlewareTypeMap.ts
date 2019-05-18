import { logMiddleware, authenticateMiddleware } from '../../middleware';
import { IMiddlewareTypeMap } from 'graphql-middleware';
import { mergeDeep } from 'apollo-utilities';

const logMiddlewareTypeMap: IMiddlewareTypeMap = {
  Query: {
    userById: logMiddleware,
  },
};

const authenticationMiddlewareTypeMap: IMiddlewareTypeMap = {
  Query: {
    users: authenticateMiddleware,
  },
};

const userMiddlewareTypeMap = mergeDeep(logMiddlewareTypeMap, authenticationMiddlewareTypeMap);

export { userMiddlewareTypeMap };
