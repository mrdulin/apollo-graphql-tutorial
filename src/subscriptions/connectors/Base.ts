class BaseConnector<Datasource> {
  public datasource: Datasource;
  constructor(datasource: Datasource) {
    this.datasource = datasource;
  }
}

export { BaseConnector };
