import { gql } from 'apollo-server';

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Query {
    uploads: [File]
  }

  type Mutation {
    singleUpload(file: Upload!): CommonResponse!
  }
`;

export { typeDefs };
