# schema-column-mapping

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
