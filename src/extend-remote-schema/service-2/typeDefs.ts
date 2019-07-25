import { gql } from 'apollo-server';

const typeDefs = gql`
  extend input PostTag {
    color: String
  }
`;

export { typeDefs };
