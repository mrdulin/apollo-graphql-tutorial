import { gql } from 'apollo-server';

export const singleUpload = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      code
      message
    }
  }
`;
