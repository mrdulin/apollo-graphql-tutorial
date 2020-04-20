import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

const source = path.resolve(__dirname, 'db.json');
const adapter = new FileSync(source);
const db = low(adapter);

db._.mixin({
  getByIds: function(array, key, items) {
    return array.filter((row) => items.includes(row[key]));
  },
  mget: function(store, keys) {
    return keys.map((k) => store[k]);
  },
});

export { db };
