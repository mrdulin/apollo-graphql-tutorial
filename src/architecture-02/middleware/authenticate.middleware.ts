import { AuthenticationError } from 'apollo-server';
const token = 'secret token 666';

const authenticateMiddleware = async (resolve, parent, args, ctx, info) => {
  const permit = ctx.request.get('Authorization') === token;

  if (!permit) {
    throw new AuthenticationError(`Not authorised!`);
  }

  return resolve();
};

export { authenticateMiddleware };
