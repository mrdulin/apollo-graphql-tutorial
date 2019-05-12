export interface IConnector<DB> {
  connect(): DB;
}
