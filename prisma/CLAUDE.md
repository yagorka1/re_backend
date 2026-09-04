# prisma — schema and migrations

## Status

The `prisma` / `@prisma/client` packages are **not installed yet** and there are no migrations.
`schema.prisma` is a stub with a datasource and generator, no models. First data task:

```bash
npm i -D prisma && npm i @prisma/client
npx prisma migrate dev --name init
```

Once that is done, delete this section — a stale status note is worse than no note.

## Rules

- **Migrations only via `prisma migrate dev`** locally and `prisma migrate deploy` in CI/production.
  Never `db push` against a schema that already has migrations — it drifts from the history.
- **Never edit an applied migration.** Got it wrong? Write a new migration on top.
  Commit everything under `prisma/migrations/`.
- **Destructive changes take two steps.** First add the new column and backfill it, ship the code,
  then drop the old one in a separate migration. A single-step `DROP COLUMN` takes production down
  mid-deploy.
- **Naming:** models are singular `PascalCase` (`Listing`), fields `camelCase`, and the physical
  table is plural snake_case via `@@map("listings")`.
- **Money** is an `Int` in minor units (para) plus a separate currency field. Not `Float`, and not
  `Decimal` without a stated reason.
- **Timestamps** are `DateTime` in UTC; every table carries `createdAt` / `updatedAt`.
- **User content is soft-deleted** (`deletedAt`) until the GDPR / Serbian data-protection
  requirements for account deletion are settled.
- After a schema change run `npx prisma generate`, then `npm run build` — generated client types
  break compilation earlier than runtime does.
- Reference-data seeds (categories, brands, sizes) go in `prisma/seed.ts` and must be idempotent
  (`upsert`).
