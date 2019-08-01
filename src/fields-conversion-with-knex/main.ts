import { createApolloServer } from './server';
import './config/env';

(async function main() {
  await createApolloServer().catch(console.error);
})();
