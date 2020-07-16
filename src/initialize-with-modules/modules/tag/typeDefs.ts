import { gql } from 'apollo-server';

const typeDefs = gql`
  type Tag {
    id: ID!
    text: String
  }
  type Query {
    tags: [Tag]!
  }
`;

export { typeDefs };
