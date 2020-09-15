import { gql } from 'apollo-server-express';

const BookSchema = gql`
  type Query {
    books: [Book]!
  }
  type Book {
    name: String!
  }
`;

export default BookSchema;
