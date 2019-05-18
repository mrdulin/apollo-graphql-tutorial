import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { IConnector } from './connector';
import { IAnyObject, ID } from '../@types';

interface ILowDbConnector<T> extends IConnector {
  findById(tableName: string, id: ID): Promise<T>;
}

class LowDbConnectorImpl<T> implements ILowDbConnector<T> {
  private db;
  constructor(config: IAnyObject) {
    const adapter = new FileSync(config.source);
    this.db = low(adapter);
  }
  public async connect() {
    //
  }
  public async disconnect() {
    //
  }
  // TODO: Model table map, then don't need tableName and specify the identity key
  public findById(tableName: string, id: string) {
    return this.db(tableName).find({ user_id: id });
  }
}

export { LowDbConnectorImpl, ILowDbConnector };
