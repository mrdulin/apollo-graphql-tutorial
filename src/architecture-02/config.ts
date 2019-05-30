import { loadEnv } from './env';
loadEnv();

const config = {
  PORT: process.env.PORT || '3000',
  GRAPHQL_ENDPOINT: '/graphql',
};

export { config };
