import * as faker from 'faker';

enum UserType {
  ZELO = 'ZELO',
  ZEWI = 'ZEWI',
  ZOWI = 'ZOWI',
  ZOLO = 'ZOLO'
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

const orgId = faker.random.uuid();
const locationId1 = faker.random.uuid();
const locationId2 = faker.random.uuid();
const locationId3 = faker.random.uuid();

interface IMemoryDB {
  locations: ILocation[];
  users: IUser[];
  templates: ITemplate[];
}

const memoryDB: IMemoryDB = {
  locations: [
    { id: locationId1, orgId, name: faker.address.city() },
    { id: locationId2, orgId, name: faker.address.city() },
    { id: locationId3, orgId: faker.random.uuid(), name: faker.address.city() }
  ],
  users: [
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      orgId: null,
      locationId: locationId1,
      userType: UserType.ZELO
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      orgId: faker.random.uuid(),
      locationId: null,
      userType: UserType.ZEWI
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      orgId,
      locationId: null,
      userType: UserType.ZOWI
    },
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      orgId: null,
      locationId: locationId3,
      userType: UserType.ZOLO
    }
  ],
  templates: [
    { id: faker.random.uuid(), name: faker.lorem.word(), shareLocationIds: [locationId1] },
    { id: faker.random.uuid(), name: faker.lorem.word(), shareLocationIds: [locationId2] }
  ]
};

export { memoryDB, UserType, ILocation, ITemplate, IUser, IMemoryDB };
