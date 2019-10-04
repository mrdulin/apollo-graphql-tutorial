# schema-column-mapping

change directory

```bash
cd src/architecture-02
```

create `.env` file:

```bash

SQL_DATABASE=nodejs-pg-knex-samples
SQL_USER=sampleadmin
SQL_PASSWORD=samplepass
```

create db migration file

```bash
cd ./db
npx knex --knexfile ./knexfile.ts migrate:make db -x ts
```

db migrate

```bash
cd ./db
npx knex --knexfile ./knexfile.ts migrate:latest db -x ts
```

seed data

```bash
cd ./db
npx knex --knexfile ./knexfile.ts seed:run
```

start `GraphQL` server:

```bash
cd ./src/architecture-02
npm run watch -- ./src/architecture-02/server.ts
```
