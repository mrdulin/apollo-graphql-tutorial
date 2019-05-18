import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { PostgreSQLConnector, DB } from '../connectors';

class PostgresSQLDataCource<TContext = any> extends DataSource {
  public context!: TContext;
  public db!: DB;
  public initialize(config: DataSourceConfig<TContext>): void {
    const connector = new PostgreSQLConnector();
    this.context = config.context;
    this.db = connector.connect();
  }
}

export { PostgresSQLDataCource };
