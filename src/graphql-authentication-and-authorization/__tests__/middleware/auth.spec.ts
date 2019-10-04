import { authMiddleware } from '../../middleware';
import { AuthenticationError } from 'apollo-server';
import { context0, context1, context2, context3 } from '../contexts';

describe('graphql-authentication-and-authorization', () => {
  describe('#authMiddleware', () => {
    const mockResolverResult = 'resolver result';
    // tslint:disable-next-line: ban-types
    const resolve: jest.Mocked<any> = jest.fn().mockResolvedValue(mockResolverResult);
    const parent = {};
    const args = {};

    const info1 = { parentType: { name: 'Query' } };
    const info2 = { parentType: { name: 'Mutation' } };
    const info3 = { parentType: { name: 'User' } };

    beforeEach(() => {
      resolve.mockClear();
    });

    it.each`
      context     | info     | name
      ${context1} | ${info1} | ${'should skip authenticate when resolve root Query type'}
      ${context1} | ${info2} | ${'should skip authenticate when resolve root Mutation type'}
      ${context1} | ${info3} | ${'should skip authenticate when resolve User type'}
    `(`$name`, async ({ context, info }) => {
      const actualValue = await authMiddleware(resolve, parent, args, context, info);
      expect(actualValue).toBe(mockResolverResult);
      expect(resolve).toBeCalledWith(parent, args, context, info);
    });

    const info4 = { parentType: { name: 'Query' }, fieldName: 'user' };
    const info5 = { parentType: { name: 'Query' }, fieldName: 'adminUsers' };
    const info6 = { parentType: { name: 'Mutation' }, fieldName: 'createPost' };
    const info7 = { parentType: { name: 'Mutation' }, fieldName: 'createUser' };
    const info8 = { parentType: { name: 'User' }, fieldName: 'bitcoinAddress' };

    it.each`
      context     | info     | name
      ${context1} | ${info4} | ${'Query.user, user.role: "viewer", required auth: "viewer:editor:admin", authentication pass'}
      ${context2} | ${info4} | ${'Query.user, user.role: "editor", required auth: "viewer:editor:admin", authentication pass'}
      ${context2} | ${info4} | ${'Query.user, user.role: "admin", required auth: "viewer:editor:admin", authentication pass'}
      ${context3} | ${info5} | ${'Query.adminUsers, user.role: "admin", required auth: "admin", authentication pass'}
      ${context3} | ${info6} | ${'Mutation.createPost, user.role: "admin", required auth: "admin", authentication pass'}
      ${context3} | ${info7} | ${'Mutation.createUser, user.role: "admin", required auth: "admin", authentication pass'}
      ${context3} | ${info8} | ${'User.bitcoinAddress, user.role: "admin", required auth: "admin", authentication pass'}
    `(`$name`, async ({ context, info }) => {
      const actualValue = await authMiddleware(resolve, parent, args, context, info);
      expect(actualValue).toBe(mockResolverResult);
      expect(resolve).toBeCalledWith(parent, args, context, info);
    });

    it.each`
      context     | info     | name
      ${context0} | ${info5} | ${'Query.adminUsers, no user, required auth: "admin", no permission'}
      ${context0} | ${info6} | ${'Mutation.createPost, no user, required auth: "admin", no permission'}
      ${context0} | ${info7} | ${'Mutation.createUser, no user, required auth: "admin", no permission'}
      ${context0} | ${info8} | ${'User.bitcoinAddress, no user, required auth: "admin", no permission'}
      ${context1} | ${info5} | ${'Query.adminUsers, user.role: "viewer", required auth: "admin", no permission'}
      ${context1} | ${info6} | ${'Mutation.createPost, user.role: "viewer", required auth: "admin", no permission'}
      ${context1} | ${info7} | ${'Mutation.createUser, user.role: "viewer", required auth: "admin", no permission'}
      ${context1} | ${info8} | ${'User.bitcoinAddress, user.role: "viewer", required auth: "admin", no permission'}
      ${context2} | ${info5} | ${'Query.adminUsers, user.role: "editor", required auth: "admin", no permission'}
      ${context2} | ${info6} | ${'Mutation.createPost, user.role: "editor", required auth: "admin", no permission'}
      ${context2} | ${info7} | ${'Mutation.createUser, user.role: "editor", required auth: "admin", no permission'}
      ${context2} | ${info8} | ${'User.bitcoinAddress, user.role: "editor", required auth: "admin", no permission'}
    `(`$name`, async ({ context, info }) => {
      await expect(authMiddleware(resolve, parent, args, context, info)).rejects.toThrowError(
        new AuthenticationError('no permission'),
      );
      expect(resolve).not.toBeCalled();
    });
  });
});
