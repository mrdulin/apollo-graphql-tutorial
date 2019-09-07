import { gql } from 'apollo-server';

const typeDefs = gql`
  type CommonResponse {
    code: Int!
    message: String!
  }
`;

export { typeDefs };
