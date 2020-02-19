import { createServer } from './rest-api-server';
import request from 'supertest';

describe('rest-api-caching', () => {
  describe('rest-api-server', () => {
    let server;
    beforeEach(() => {
      server = createServer();
    });
    afterEach((done) => {
      server.close(done);
    });
    it('should return user', async () => {
      const res = await request(server).get('/api/user');
      expect(res.status).toBe(200);
      console.log(res.body);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('email');
    });
  });
});
