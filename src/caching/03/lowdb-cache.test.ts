import { TestableKeyValueCache } from 'apollo-server-caching';
import { LowdbCache, ILowdbOptions } from './lowdb-cache';
import path from 'path';

export function testKeyValueCache_Basics(keyValueCache: TestableKeyValueCache) {
  describe('basic cache functionality', () => {
    beforeEach(() => {
      if (keyValueCache.flush) {
        keyValueCache.flush();
      }
    });

    it('can do a basic get and set', async () => {
      await keyValueCache.set('hello', 'world');
      expect(await keyValueCache.get('hello')).toBe('world');
      expect(await keyValueCache.get('missing')).toBeUndefined();
    });

    it('can do a basic set and delete', async () => {
      await keyValueCache.set('hello', 'world');
      expect(await keyValueCache.get('hello')).toBe('world');
      await keyValueCache.delete('hello');
      expect(await keyValueCache.get('hello')).toBeUndefined();
    });
  });
}

const options: ILowdbOptions = { adapter: 'FileSync', source: path.resolve(__dirname, 'lowdb-cache-test.json') };
testKeyValueCache_Basics(new LowdbCache(options));
