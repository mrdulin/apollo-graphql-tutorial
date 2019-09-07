import { IAnyObject, Options, Command, Parameters } from '../@types';
import { EntityData } from '../models/model';

export interface IConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute?(command: Command, parameters: Parameters, options?: Options): Promise<IAnyObject>;
}

export interface ICURDConnector<T extends object> extends IConnector {
  create(entity: EntityData<T>, options?: Options): Promise<EntityData<T>>;
  update(entity: EntityData<T>, options?: Options): Promise<boolean>;
  find(filter?: any, options?: Options): Promise<Array<EntityData<T>>>;
  delete(entity?: EntityData<T>, options?: Options): Promise<boolean>;
}
