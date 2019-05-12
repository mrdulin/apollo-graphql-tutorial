import { logMiddleware } from '../../middleware';
import { IMiddlewareTypeMap } from 'graphql-middleware';
import { mergeDeep } from 'apollo-utilities';

const logMiddlewareTypeMap: IMiddlewareTypeMap = {
  Query: {
    addressById: logMiddleware,
  },
};

const addressMiddlewareTypeMap = mergeDeep(logMiddlewareTypeMap);

export { addressMiddlewareTypeMap };
