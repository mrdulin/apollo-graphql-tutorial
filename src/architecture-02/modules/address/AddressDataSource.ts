export interface IAddressDataSource {
  findById(id: string): Promise<any>;
}
