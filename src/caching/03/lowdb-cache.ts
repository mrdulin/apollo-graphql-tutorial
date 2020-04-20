import { TestableKeyValueCache, KeyValueCacheSetOptions } from 'apollo-server-caching';
import low, { AdapterSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import Memory from 'lowdb/adapters/Memory';
import DataLoader from 'dataloader';

export interface ILowdbOptions {
  adapter: 'FileSync' | 'Memory';
  source: string;
}

interface IStore {
  [key: string]: any;
}

// TODO: ttl
export class LowdbCache implements TestableKeyValueCache<string> {
  public readonly client: any;
  private adapterMap: Map<string, AdapterSync> = new Map([
    ['FileSync', FileSync],
    ['Memory', Memory],
  ]);
  private loader: DataLoader<string, string | null>;
  private defaultValue: { store: IStore } = {
    store: {},
  };

  constructor(options: ILowdbOptions) {
    const Adapter: AdapterSync | undefined = this.adapterMap.get(options.adapter);
    if (!Adapter) {
      throw new Error(`Adapter: ${options.adapter} not found.`);
    }
    const adapter = new Adapter(options.source);
    this.client = low(adapter);
    this.client.defaults(this.defaultValue).write();
    this.client._.mixin({
      mget: ({ store }: { store: IStore }, keys: Array<string | number>) => {
        return keys.map((k) => store[k]);
      },
    });
    this.loader = new DataLoader((keys) => Promise.resolve(this.client.mget(keys).value()), { cache: false });
  }

  public async set(key: string, value: string, options?: KeyValueCacheSetOptions) {
    await this.client.set(`store.${key}`, value).write();
  }

  public async get(key: string): Promise<string | undefined> {
    const reply = await this.loader.load(key);
    if (reply !== null) {
      return reply;
    }
    return;
  }

  public async delete(key: string): Promise<boolean> {
    return await this.client.unset(`store.${key}`).write();
  }
}
