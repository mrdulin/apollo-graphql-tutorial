import { gql } from '@apollo/client';

const GET_ROCKETS = gql`
  query GetRockets {
    rockets {
      id
      name
    }
  }
`;
const GET_ROCKET = gql`
  query GetRocket($id: ID!) {
    rocket(id: $id) {
      mass {
        kg
        lb
      }
      name
    }
  }
`;
export { GET_ROCKETS, GET_ROCKET };
