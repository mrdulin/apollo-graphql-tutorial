import * as faker from 'faker';

enum UserType {
  ZELO = 'ZELO',
  ZEWI = 'ZEWI',
  ZOWI = 'ZOWI',
  ZOLO = 'ZOLO',
}

interface ILocation {
  id: string;
  orgId: string;
  name: string;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  orgId: string | null;
  locationId: string | null;
  userType: UserType;
}

interface ITemplate {
  id: string;
  name: string;
  shareLocationIds: string[];
}

const orgId1 = faker.random.uuid();
const orgId2 = faker.random.uuid();
const locationId1 = '1';
const locationId2 = '2';
const locationId3 = '3';
const locationId4 = '4';

interface IMemoryDB {
  locations: ILocation[];
  users: IUser[];
  templates: ITemplate[];
}

const memoryDB: IMemoryDB = {
  locations: [
    { id: locationId1, orgId: orgId1, name: faker.address.city() },
    { id: locationId2, orgId: orgId1, name: faker.address.city() },
    { id: locationId3, orgId: orgId2, name: faker.address.city() },
    { id: locationId4, orgId: orgId2, name: faker.address.city() },
  ],
  users: [
    {
      id: '1',
      name: faker.name.findName(),
      email: 'user-1@gmail.com',
      orgId: null,
      locationId: locationId1,
      userType: UserType.ZELO,
    },
    {
      id: '2',
      name: faker.name.findName(),
      email: 'user-2@gmail.com',
      orgId: orgId2,
      locationId: null,
      userType: UserType.ZEWI,
    },
    {
      id: '3',
      name: faker.name.findName(),
      email: 'user-3@gmail.com',
      orgId: orgId1,
      locationId: null,
      userType: UserType.ZOWI,
    },
    {
      id: '4',
      name: faker.name.findName(),
      email: 'user-4@gmail.com',
      orgId: null,
      locationId: locationId3,
      userType: UserType.ZOLO,
    },
  ],
  templates: [
    { id: faker.random.uuid(), name: faker.lorem.word(), shareLocationIds: [locationId1] },
    { id: faker.random.uuid(), name: faker.lorem.word(), shareLocationIds: [locationId2] },
  ],
};

export { memoryDB, UserType, ILocation, ITemplate, IUser, IMemoryDB };
