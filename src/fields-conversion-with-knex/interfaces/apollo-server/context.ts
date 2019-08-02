import Knex from 'knex';
import { IPostLoader, IUserLoader } from '../../modules';

interface IAppContext {
  knex: Knex;
  PostLoader: IPostLoader;
  UserLoader: IUserLoader;
}

export { IAppContext };
