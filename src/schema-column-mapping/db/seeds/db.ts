import * as Knex from 'knex';
import faker from 'faker';

export async function seed(knex: Knex): Promise<any> {
  await knex('addresses').insert([
    {
      address_id: 1,
      address_city: faker.address.city(),
      address_country: faker.address.country(),
      address_state: faker.address.state(),
    },
    {
      address_id: 2,
      address_city: faker.address.city(),
      address_country: faker.address.country(),
      address_state: faker.address.state(),
    },
  ]);
  await knex('users').insert([
    { user_id: 1, user_nme: faker.name.findName(), user_email: faker.internet.email(), user_address_id: 1 },
    { user_id: 2, user_nme: faker.name.findName(), user_email: faker.internet.email(), user_address_id: 1 },
    { user_id: 3, user_nme: faker.name.findName(), user_email: faker.internet.email(), user_address_id: 2 },
  ]);
}
