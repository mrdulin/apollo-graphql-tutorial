import { setupApi } from './setup';
import { gql } from 'apollo-server';

const client = setupApi();

export const GET_ASSET_ID = gql`
  query getAssetByExternalId($externalId: String!) {
    assetId: getAssetId(externalId: $externalId) {
      id
    }
  }
`;

export const getAssetIdFromService = async (externalId: string) => {
  return await client.query({
    query: GET_ASSET_ID,
    variables: { externalId },
  });
};
