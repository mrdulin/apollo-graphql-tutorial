import { BaseConnector } from './Base';
import { IMemoryDB } from '../datasources/memoryDB';

class TemplateConnector<Datasource extends IMemoryDB> extends BaseConnector<Datasource> {
  constructor(datasource: Datasource) {
    super(datasource);
  }

  public getAll() {
    return this.datasource.templates;
  }
}

export { TemplateConnector };
