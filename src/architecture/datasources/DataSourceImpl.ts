import { IDataSource } from './datasource';
import { IConnector } from '../connectors/connector';
import { IAnyObject } from '../@types';
import { LowDbConnectorImpl } from '../connectors/LowDBConnectorImpl';

interface IDataSourceConfig {
  name: 'lowdb';
  settings: IAnyObject;
}

class DataSourceImpl implements IDataSource {
  private name: string;
  private connector?: IConnector;
  private settings: IAnyObject;
  constructor(config: IDataSourceConfig) {
    this.name = config.name;
    this.settings = config.settings;
  }
  public async initialize() {
    switch (this.name) {
      case 'lowdb':
        this.connector = new LowDbConnectorImpl(this.settings);
        break;
    }
    if (!this.connector) {
      throw new Error(`connector ${this.name} doesn't exists`);
    }
    try {
      await this.connector.connect();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public getConnector() {
    if (!this.connector) {
      throw new Error(`connector ${this.name} doesn't exists`);
    }
    return this.connector;
  }
}

export { DataSourceImpl };
