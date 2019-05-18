import { Command, IAnyObject, Options, Parameters, ICount } from '../@types';

export interface IRepository {
  execute?(command: Command, parameters: Parameters, options?: Options): Promise<IAnyObject>;
}

export interface ICURDRepository<T> extends IRepository {
  create(dataObject: any, options?: Options): Promise<T>;
  update(dataObject: any, where?: any, options?: Options): Promise<ICount>;
  find(filter?: any, options?: Options): Promise<T[]>;
  delete(where?: any, options?: Options): Promise<ICount>;
}
