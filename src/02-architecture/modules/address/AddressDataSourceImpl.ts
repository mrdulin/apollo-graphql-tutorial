import { PostgresSQLDataCource } from '../../datasources';
import { IAddressDataSource } from './AddressDataSource';

class AddressDataSourceImpl extends PostgresSQLDataCource implements IAddressDataSource {
  constructor() {
    super();
  }
  public async findById(id: string) {
    return this.db('addresses')
      .where({ address_id: id })
      .first();
  }
}

export { AddressDataSourceImpl };
