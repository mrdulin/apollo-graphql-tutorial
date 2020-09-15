import { gql } from 'apollo-server-express';

const UserSchema = gql`
  type Query {
    whoami: User
  }
  type User {
    name: String!
  }
`;

export default UserSchema;
