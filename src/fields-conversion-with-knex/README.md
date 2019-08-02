# fields convertion with knex

db migration

```bash
☁  fields-conversion-with-knex [master] ⚡  npx knex migrate:make initialize_db --cwd ./db
Requiring external module ts-node/register
Working directory changed to ~/workspace/github.com/mrdulin/apollo-graphql-tutorial/src/fields-conversion-with-knex/db
dotenvConfigOutput:  {
  "SQL_HOST": "127.0.0.1",
  "SQL_PORT": "5431",
  "SQL_DATABASE": "nodejs-pg-knex-samples",
  "SQL_USER": "sampleadmin",
  "SQL_PASSWORD": "samplepass",
  "SQL_SSL": "false"
}
Using environment: development
Created Migration: /Users/ldu020/workspace/github.com/mrdulin/apollo-graphql-tutorial/src/fields-conversion-with-knex/db/migrations/20190801114458_initialize_db.js
```

seed db

```bash
☁  fields-conversion-with-knex [master] ⚡  npx knex seed:make initialize_db --cwd ./db
Requiring external module ts-node/register
Working directory changed to ~/workspace/github.com/mrdulin/apollo-graphql-tutorial/src/fields-conversion-with-knex/db
dotenvConfigOutput:  {
  "SQL_HOST": "127.0.0.1",
  "SQL_PORT": "5431",
  "SQL_DATABASE": "nodejs-pg-knex-samples",
  "SQL_USER": "sampleadmin",
  "SQL_PASSWORD": "samplepass",
  "SQL_SSL": "false"
}
Using environment: development
Created seed file: /Users/ldu020/workspace/github.com/mrdulin/apollo-graphql-tutorial/src/fields-conversion-with-knex/db/seeds/initialize_db.ts
```

start

```bash
npx ts-node main.ts
```
