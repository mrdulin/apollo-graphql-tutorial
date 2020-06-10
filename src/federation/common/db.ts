import faker from 'faker';

const MemoryDB = {
  users: [
    { id: 1, name: faker.name.findName() },
    { id: 2, name: faker.name.findName() },
  ],
  products: [
    { upc: 1, name: faker.commerce.product(), price: faker.commerce.price() },
    { upc: 2, name: faker.commerce.product(), price: faker.commerce.price() },
    { upc: 3, name: faker.commerce.product(), price: faker.commerce.price() },
  ],
  reviews: [
    { id: 1, product_upc: 3 },
    { id: 2, product_upc: 2 },
    { id: 3, product_upc: 1 },
    { id: 4, product_upc: 1 },
  ],
};

export { MemoryDB };
