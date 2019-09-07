import { createTestClient } from 'apollo-server-testing';
import { schema } from '../../schemaWIthMiddleware';
import { ApolloServer } from 'apollo-server';
import * as Q from '../queries';
import * as M from '../mutations';
import { context0, context1, context2, context3 } from '../contexts';
import { Role } from '../../db';

describe('auth with middleware', () => {
  describe('Query.user', () => {
    it.each`
      context     | gql                         | operationName                   | name
      ${context0} | ${Q.user}                   | ${'userById'}                   | ${'no user found, required auth: "viewer:editor:admin"'}
      ${context1} | ${Q.user}                   | ${'userById'}                   | ${'user.role: "viewer", required auth: "viewer:editor:admin"'}
      ${context2} | ${Q.user}                   | ${'userById'}                   | ${'user.role: "editor", required auth: "viewer:editor:admin"'}
      ${context3} | ${Q.user}                   | ${'userById'}                   | ${'user.role: "admin", required auth: "viewer:editor:admin"'}
      ${context1} | ${Q.userWithBitcoinAddress} | ${'userByIdWithBitcoinAddress'} | ${'user.role: "viewer", required auth: "viewer:editor:admin", bitcoinAddress require auth: "admin"'}
    `(`$name`, async ({ context, gql, operationName }) => {
      const server = new ApolloServer({ schema, context });
      const { query } = createTestClient(server);
      const actualValue = await query({ query: gql, operationName, variables: { id: 1 } });
      expect(actualValue).toMatchSnapshot();
    });
  });

  describe(`Query.adminUsers | required roles: ${Role.admin}`, () => {
    const adminUsersOperationName = 'adminUsers';
    it.each`
      context     | gql             | operationName              | name
      ${context0} | ${Q.adminUsers} | ${adminUsersOperationName} | ${'no user found'}
      ${context1} | ${Q.adminUsers} | ${adminUsersOperationName} | ${'user.role: "viewer"'}
      ${context2} | ${Q.adminUsers} | ${adminUsersOperationName} | ${'user.role: "editor"'}
      ${context3} | ${Q.adminUsers} | ${adminUsersOperationName} | ${'user.role: "admin"'}
    `(`$name`, async ({ context, gql, operationName }) => {
      const server = new ApolloServer({ schema, context });
      const { query } = createTestClient(server);
      const actualValue = await query({ query: gql, operationName });
      expect(actualValue).toMatchSnapshot();
    });
  });

  describe(`Mutation.createPost | required roles: ${Role.admin}`, () => {
    const createPostOperationName = 'createPost';
    it.each`
      context     | gql             | operationName              | name
      ${context0} | ${M.createPost} | ${createPostOperationName} | ${'no user found'}
      ${context1} | ${M.createPost} | ${createPostOperationName} | ${'user.role: "viewer"'}
      ${context2} | ${M.createPost} | ${createPostOperationName} | ${'user.role: "editor"'}
      ${context3} | ${M.createPost} | ${createPostOperationName} | ${'user.role: "admin"'}
    `(`$name`, async ({ context, gql, operationName }) => {
      const server = new ApolloServer({ schema, context });
      const { query } = createTestClient(server);
      const createPostInput = {
        title: 'jest',
        content: 'jest content',
      };
      const actualValue = await query({ query: gql, operationName, variables: { input: createPostInput } });
      expect(actualValue).toMatchSnapshot();
    });
  });
});
