import { BaseConnector } from './Base';
import { IMemoryDB, ILocation } from '../datasources/memoryDB';

class LocationConnector<Datasource extends IMemoryDB> extends BaseConnector<Datasource> {
  constructor(datasource: Datasource) {
    super(datasource);
  }

  public findLocationsByOrgId(id: string) {
    return this.datasource.locations.filter(location => location.orgId === id);
  }

  public findLocationIdsByOrgId(id: string) {
    return this.findLocationsByOrgId(id).map(loc => loc.id);
  }

  public findAll(): ILocation[] {
    return this.datasource.locations;
  }
}

export { LocationConnector };
