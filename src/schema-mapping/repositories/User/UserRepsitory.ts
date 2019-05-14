import { IRepository } from '../repository';
import { ID } from '../../@types';

export interface IUserRepsitory<T> extends IRepository {
  findById(id: ID): Promise<T>;
}
