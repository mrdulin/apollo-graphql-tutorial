import { getSchema, getSchemaPerfIssue } from './schema';
import { getUserServiceSchema, getPostServiceSchema, getTagServiceSchema } from './util';
import { mocked } from 'ts-jest/utils';
import { gql, makeExecutableSchema } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { sleep } from '../../util';

jest.mock('./util');

describe('03-merge-multiple-schemas-perf-issue', () => {
  const user = {
    typeDefs: gql`
      type User {
        id: ID!
        email: String!
      }
      type Query {
        userById(id: ID!): User
      }
    `,
    resolvers: {
      Query: {
        userById() {
          return { id: 1, email: '123@gmail.com' };
        },
      },
    },
  };
  const userSchema = makeExecutableSchema({ typeDefs: user.typeDefs, resolvers: user.resolvers });

  const post = {
    typeDefs: gql`
      type Post {
        id: ID!
        title: String!
      }
      type Query {
        postById(id: ID!): Post
      }
    `,
    resolvers: {
      Query: {
        postById() {
          return { id: 1, title: 'apollo graphql' };
        },
      },
    },
  };
  const postSchema = makeExecutableSchema({ typeDefs: post.typeDefs, resolvers: post.resolvers });

  const tag = {
    typeDefs: gql`
      type Tag {
        id: ID!
        name: String!
      }
      type Query {
        tagById(id: ID!): Tag
      }
    `,
    resolvers: {
      Query: {
        tagById() {
          return { id: 1, name: 'graphql' };
        },
      },
    },
  };

  const tagSchema = makeExecutableSchema({ typeDefs: tag.typeDefs, resolvers: tag.resolvers });

  describe('#getSchema', () => {
    it('should merge schemas', async () => {
      const start = Date.now();
      const latency = 2000;
      mocked(getUserServiceSchema).mockResolvedValueOnce(userSchema);
      mocked(getPostServiceSchema).mockImplementationOnce(async () => {
        await sleep(latency);
        return postSchema;
      });
      mocked(getTagServiceSchema).mockResolvedValueOnce(tagSchema);
      const actual = await getSchemaPerfIssue();
      const end = Date.now();
      expect(actual).toBeInstanceOf(GraphQLSchema);
      expect(end - start).toBeGreaterThanOrEqual(latency);
    });

    it("should throw error if can't get any remote schema", async () => {
      mocked(getUserServiceSchema).mockResolvedValueOnce(userSchema);
      mocked(getPostServiceSchema).mockResolvedValueOnce(postSchema);
      mocked(getTagServiceSchema).mockRejectedValueOnce(new Error('network'));
      await expect(getSchema()).rejects.toThrowError('get schema error');
    });
  });
});
