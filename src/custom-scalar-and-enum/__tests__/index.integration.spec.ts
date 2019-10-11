import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { resolvers } from '../resolvers';
import { typeDefs } from '../typeDefs';
import { db } from '../db';
import { ApolloServerBase, gql, GraphQLResponse } from 'apollo-server-core';
import { printSchema, GraphQLSchema } from 'graphql';

const Q = {
  campaignPerformanceReports: gql`
    query campaignPerformanceReports {
      campaignPerformanceReports {
        campaignNme
        campaignId
        device
      }
    }
  `,
};

describe('custom-scalar-and-enum integration tests', () => {
  describe('Query#campaignPerformanceReports', () => {
    test('should query campaign performance reports correctly with correct device enum value', async () => {
      const server: ApolloServerBase = new ApolloServer({ typeDefs, resolvers, context: { db } });
      // tslint:disable-next-line: no-string-literal
      console.log(printSchema(server['schema'] as GraphQLSchema));
      const { query }: ApolloServerTestClient = createTestClient(server);
      const res: GraphQLResponse = await query({ query: Q.campaignPerformanceReports });
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "campaignPerformanceReports": Array [
              Object {
                "campaignId": "1",
                "campaignNme": "test",
                "device": "DESKTOP",
              },
            ],
          },
          "errors": undefined,
          "extensions": undefined,
          "http": Object {
            "headers": Headers {
              Symbol(map): Object {},
            },
          },
        }
      `);
    });

    test.only('should query campaign performance reports correctly with executable graphql schema', async () => {
      const schema = makeExecutableSchema({ typeDefs, resolvers });
      console.log(printSchema(schema));
      const server: ApolloServerBase = new ApolloServer({ schema, context: { db } });
      const { query }: ApolloServerTestClient = createTestClient(server);
      const res: GraphQLResponse = await query({ query: Q.campaignPerformanceReports });
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "campaignPerformanceReports": Array [
              Object {
                "campaignId": "1",
                "campaignNme": "test",
                "device": "DESKTOP",
              },
            ],
          },
          "errors": undefined,
          "extensions": undefined,
          "http": Object {
            "headers": Headers {
              Symbol(map): Object {},
            },
          },
        }
      `);
    });
  });
});
