import { LocationConnector } from './Location';
import { UserConnector } from './User';
import { TemplateConnector } from './Template';
import { IMemoryDB } from '../datasources/memoryDB';

interface IConnectors<Datasource extends IMemoryDB> {
  locationConnector: LocationConnector<Datasource>;
  userConnector: UserConnector<Datasource>;
  templateConnector: TemplateConnector<Datasource>;
}

export { IConnectors, LocationConnector, UserConnector, TemplateConnector };
