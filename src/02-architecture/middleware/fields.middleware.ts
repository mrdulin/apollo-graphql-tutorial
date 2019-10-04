import graphqlFields from 'graphql-fields';
import { snakeCase } from 'lodash';

const selectFieldsMiddleware = async (resolve, parent, args, ctx, info) => {
  const selectFields = Object.keys(graphqlFields(info));
  ctx.selectFields = selectFields.map(snakeCase);
  return resolve(parent, args, ctx, info);
};

export { selectFieldsMiddleware };
