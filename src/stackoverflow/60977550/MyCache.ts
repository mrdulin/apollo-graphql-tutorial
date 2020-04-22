import { KeyValueCache, KeyValueCacheSetOptions } from 'apollo-server-caching';

export default class MyCache implements KeyValueCache {
  private cachedInfo = {};

  public async set(key: string, value: string, options?: KeyValueCacheSetOptions): Promise<void> {
    this.cachedInfo[key] = value;
  }

  public async get(key: string): Promise<string | undefined> {
    if (this.cachedInfo[key]) {
      return this.cachedInfo[key];
    }
  }

  public async delete(key: string): Promise<boolean> {
    this.cachedInfo[key] = null;
    return this.cachedInfo[key] === null;
  }
}
