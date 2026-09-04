# src/common — shared code

Only code that belongs to **no single domain** and is used by at least two modules goes here.
Do not let this become a dumping ground: code with one consumer lives in that consumer's module.

```
decorators/    # @CurrentUser(), @Public(), @Roles()
dto/           # pagination, cursors, the shared error shape
filters/       # global exception filters
guards/        # authentication, roles, rate limiting
interceptors/  # logging, timing, response serialization
pipes/         # shared validation / transformation pipes
types/         # shared types and type guards
utils/         # pure functions: money, slugs, dates
```

## Rules

- **Never import from `src/modules/`.** The dependency runs one way: `modules → common`.
  An import in the other direction means the code belongs in a module.
- **Utilities are pure functions**, each covered by a unit test next to it (`money.spec.ts`).
- **The API-wide error shape** is defined here, not re-invented in each controller.
- Everything here is internal contract: change a signature and check every consumer
  (`npm run build` catches most of it).
