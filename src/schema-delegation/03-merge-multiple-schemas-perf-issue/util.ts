import { introspectSchema } from 'apollo-server';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'cross-fetch';

async function getRemoteSchema(uri: string) {
  const link = new HttpLink({ uri, fetch });
  return introspectSchema(link);
}
export async function getUserServiceSchema() {
  return getRemoteSchema('http://localhost:3001/graphql');
}
export async function getPostServiceSchema() {
  return getRemoteSchema('http://localhost:3002/graphql');
}
export async function getTagServiceSchema() {
  return getRemoteSchema('http://localhost:3003/graphql');
}
