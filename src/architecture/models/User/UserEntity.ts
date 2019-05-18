import { IAddressEntity } from '../Address/AddressEntity';
import { EntityData } from '../model';

export interface IUserEntity {
  user_id: string;
  user_nme: string;
  user_email: string;
  user_address: IAddressEntity;
}

export type UserEntityData = EntityData<IUserEntity>;
