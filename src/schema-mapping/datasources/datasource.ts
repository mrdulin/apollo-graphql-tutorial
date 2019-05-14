import { IConnector } from '../connectors/connector';

export interface IDataSource {
  getConnector(): IConnector;
}
