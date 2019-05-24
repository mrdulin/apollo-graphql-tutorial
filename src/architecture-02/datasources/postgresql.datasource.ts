import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { PostgreSQLConnector, DB } from '../connectors';
import DataLoader from 'dataloader';

class PostgresSQLDataCource<TContext = any> extends DataSource {
  public context!: TContext;
  public db!: DB;
  public initialize(config: DataSourceConfig<TContext>): void {
    const connector = new PostgreSQLConnector();
    this.context = config.context;
    this.db = connector.connect();
  }

  public createLoader<K, V>(batchLoadFn: DataLoader.BatchLoadFn<K, V>): DataLoader<K, V> {
    return new DataLoader<K, V>(batchLoadFn);
  }
}

export { PostgresSQLDataCource, DataLoader };
