class BaseConnector<Datasource> {
  protected datasource: Datasource;
  constructor(datasource: Datasource) {
    this.datasource = datasource;
  }
}

export { BaseConnector };
