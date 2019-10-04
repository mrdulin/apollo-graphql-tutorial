import { gql } from 'apollo-server';

const typeDefs = gql`
  directive @camelizeKeys on OBJECT
`;

export { typeDefs };
