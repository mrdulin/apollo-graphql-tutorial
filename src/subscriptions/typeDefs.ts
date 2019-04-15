import { gql } from 'apollo-server';

const typeDefs = gql`
  type Template {
    id: ID!
    name: String!
    shareLocationIds: [ID!]
  }

  input EditTemplateInput {
    id: ID!
    name: String
    shareLocationIds: [ID!]
  }

  input AddTemplateInput {
    name: String!
    shareLocationIds: [ID!]
  }

  type Location {
    id: ID!
    name: String!
    orgId: ID!
  }

  type CommonResponse {
    success: Boolean!
    message: String
  }

  type Query {
    templates: [Template!]
    templateById(id: ID!): Template
    locations: [Location!]
    locationsByOrgId(id: ID!): [Location!]
  }

  type Mutation {
    editTemplate(templateInput: EditTemplateInput!): CommonResponse
    addTemplate(templateInput: AddTemplateInput!): CommonResponse
  }

  type Subscription {
    templateAdded: Template
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

export { typeDefs };
