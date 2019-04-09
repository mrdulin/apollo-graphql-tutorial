import { gql } from 'apollo-server';

const typeDefs = gql`
  type Template {
    id: ID!
    name: String!
    shareLocationIds: [ID!]
  }

  input TemplateInput {
    id: ID!
    name: String
    shareLocationIds: [ID!]
  }

  type Location {
    id: ID!
    name: String!
    orgId: ID!
  }

  type Query {
    templates: [Template!]
    templateById(id: ID!): Template
    locationsByOrgId(id: ID!): [Location!]
  }

  type CommonResponse {
    success: Boolean!
    message: String
  }

  type Mutation {
    editTemplate(templateInput: TemplateInput!): CommonResponse!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

export { typeDefs };
