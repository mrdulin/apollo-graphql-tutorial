import { getAssetIdFromService, GET_ASSET_ID } from './getAssetIdFromService';
import { setupApi } from './setup';

jest.mock('./setup.ts', () => {
  const mApolloClient = { query: jest.fn() };
  return { setupApi: jest.fn(() => mApolloClient) };
});

describe('59829676', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should query and return data', async () => {
    const client = setupApi();
    const mGraphQLResponse = { data: {}, loading: false, errors: [] };
    client.query.mockResolvedValueOnce(mGraphQLResponse);
    const { data, loading, errors } = await getAssetIdFromService('e1');
    expect(client.query).toBeCalledWith({ query: GET_ASSET_ID, variables: { externalId: 'e1' } });
    expect(data).toEqual({});
    expect(loading).toBeFalsy();
    expect(errors).toEqual([]);
  });
});
