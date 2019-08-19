import { UserLoaderWithoutCaching, UserLoader } from '../../../modules/user';

describe('UserLoaderWithoutCaching', () => {
  describe('#findByIds', () => {
    it('t-1', async () => {
      const results = await Promise.all([
        UserLoaderWithoutCaching.findByIds.load(1),
        UserLoaderWithoutCaching.findByIds.load(2),
        UserLoaderWithoutCaching.findByIds.load(1),
      ]);
      console.log(`[UserLoaderWithoutCaching.findByIds]: ${JSON.stringify(results)}`);
    });
  });
});

describe('UserLoader', () => {
  describe('#findByIds', () => {
    it('batches multiple requests', async () => {
      const { loader, loadCalls } = UserLoader.findByIds();
      const [a, b] = await Promise.all([loader.load(1), loader.load(2)]);
      expect(a).toEqual({ id: 1, name: 'a', email: 'a@gmail.com' });
      expect(b).toEqual({ id: 2, name: 'b', email: 'b@gmail.com' });
      expect(loadCalls).toEqual([[1, 2]]);
    });

    it('caches repeated requests', async () => {
      const { loader, loadCalls, getCache } = UserLoader.findByIds();
      const [a, b] = await Promise.all([loader.load(1), loader.load(2)]);
      expect(a).toEqual({ id: 1, name: 'a', email: 'a@gmail.com' });
      expect(b).toEqual({ id: 2, name: 'b', email: 'b@gmail.com' });
      expect(loadCalls).toEqual([[1, 2]]);

      const [a2, c] = await Promise.all([loader.load(1), loader.load(3)]);
      expect(a2).toEqual({ id: 1, name: 'a', email: 'a@gmail.com' });
      expect(c).toEqual({ id: 3, name: 'c', email: 'c@gmail.com' });
      expect(loadCalls).toEqual([[1, 2], [3]]);

      const [a3, b2, c2] = await Promise.all([loader.load(1), loader.load(2), loader.load(3)]);
      expect(a3).toEqual({ id: 1, name: 'a', email: 'a@gmail.com' });
      expect(b2).toEqual({ id: 2, name: 'b', email: 'b@gmail.com' });
      expect(c2).toEqual({ id: 3, name: 'c', email: 'c@gmail.com' });
      expect(loadCalls).toEqual([[1, 2], [3]]);
    });

    it('clears single value in loader', async () => {
      const { loader, loadCalls, getCache } = UserLoader.findByIds();
      const [a, b] = await Promise.all([loader.load(1), loader.load(2)]);
      expect(a).toEqual({ id: 1, name: 'a', email: 'a@gmail.com' });
      expect(b).toEqual({ id: 2, name: 'b', email: 'b@gmail.com' });
      expect(loadCalls).toEqual([[1, 2]]);
      // console.log(`cacheMap before clear: ${JSON.stringify(getCache())}`); //{"1":{},"2":{}}
      loader.clear(1);
      // console.log(`cacheMap after clear: ${JSON.stringify(getCache())}`); //{"2":{}}

      const [a2, b2] = await Promise.all([loader.load(1), loader.load(2)]);
      expect(a2).toEqual({ id: 1, name: 'a', email: 'a@gmail.com' });
      expect(b2).toEqual({ id: 2, name: 'b', email: 'b@gmail.com' });
      expect(loadCalls).toEqual([[1, 2], [1]]);
    });
  });
});
