import { ApolloServer } from 'apollo-server-express';
import { server, contextFunction } from './server';

describe('server', () => {
  it('should initialize apollo server', () => {
    expect(server).toBeInstanceOf(ApolloServer);
  });
  it('should create context', () => {
    const mockedReq = {};
    const mockedRes = {};
    const actualValue = contextFunction({ req: mockedReq, res: mockedRes });
    expect(actualValue).toEqual({ req: mockedReq, res: mockedRes });
  });
});
