import { gql } from 'apollo-server';
import * as fragments from './fragments';

export const user = gql`
  query userById($id: ID!) {
    user(id: $id) {
      ...UserBaseInfo
    }
  }
  ${fragments.userBaseInfo}
`;

export const userWithBitcoinAddress = gql`
  query userByIdWithBitcoinAddress($id: ID!) {
    user(id: $id) {
      ...UserBaseInfo
      bitcoinAddress
    }
  }
  ${fragments.userBaseInfo}
`;

export const adminUsers = gql`
  query adminUsers {
    adminUsers {
      ...UserBaseInfo
    }
  }
  ${fragments.userBaseInfo}
`;
