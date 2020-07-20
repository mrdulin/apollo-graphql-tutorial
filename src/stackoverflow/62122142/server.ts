import { ApolloServer } from 'apollo-server';
import { schema } from './schema';

const server = new ApolloServer({ schema });

export { server };
